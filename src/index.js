export const getPath=(v,p)=>p.split('.').reduce((x,k)=>x==null?undefined:x[k],v);
const time=v=>typeof v==='number'?v:Date.parse(v);
const quantile=(a,q)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(q*s.length)-1)]};
export function analyze(rows,{sourcePath='sourceTime',receivedPath='receivedTime',entityPath='source',jumpMs=1000}={}){
  const groups=new Map(),invalid=[];
  rows.forEach((row,index)=>{const entity=getPath(row,entityPath),source=time(getPath(row,sourcePath)),received=time(getPath(row,receivedPath));if(entity==null||!Number.isFinite(source)||!Number.isFinite(received)){invalid.push({line:index+1,reason:entity==null?'missing entity':'invalid timestamp'});return}const group=groups.get(String(entity))||[];group.push({line:index+1,source,received,offset:received-source});groups.set(String(entity),group)});
  const entities=[];for(const [entity,events] of groups){events.sort((a,b)=>a.received-b.received);const offsets=events.map(e=>e.offset),jumps=[];for(let i=1;i<events.length;i++){const change=events[i].offset-events[i-1].offset;if(Math.abs(change)>jumpMs)jumps.push({line:events[i].line,at:new Date(events[i].received).toISOString(),changeMs:change})}entities.push({entity,count:events.length,minMs:Math.min(...offsets),medianMs:quantile(offsets,.5),p95Ms:quantile(offsets,.95),maxMs:Math.max(...offsets),maxAbsMs:Math.max(...offsets.map(Math.abs)),driftMs:offsets.at(-1)-offsets[0],futureCount:offsets.filter(x=>x<0).length,jumps})}
  entities.sort((a,b)=>b.maxAbsMs-a.maxAbsMs||a.entity.localeCompare(b.entity));return {recordCount:rows.length,entityCount:entities.length,invalid,jumpCount:entities.reduce((n,e)=>n+e.jumps.length,0),entities};
}
