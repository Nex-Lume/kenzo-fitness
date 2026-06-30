const fs=require('fs');
const path=require('path');

const mongooseOperators = [
  'or', 'and', 'regex', 'options', 'gte', 'lte', 'gt', 'lt', 
  'set', 'push', 'pull', 'inc', 'match', 'group', 'sum', 
  'sort', 'project', 'lookup', 'unwind', 'in', 'ne', 'elemMatch', 'exists', 'dayOfMonth', 'month', 'year'
];

function walk(d){
  fs.readdirSync(d).forEach(f=>{
    const p=path.join(d,f);
    if(fs.statSync(p).isDirectory()){
      if(f!=='node_modules'&&f!=='.git') walk(p);
    } else if(p.endsWith('.js')||p.endsWith('.jsx')){
      let c=fs.readFileSync(p,'utf8');
      const og=c;
      
      // Fix mongoose operators
      mongooseOperators.forEach(op => {
        const regex = new RegExp(`₹${op}`, 'g');
        c = c.replace(regex, `$${op}`);
      });
      
      // Some formatting edge cases
      c = c.replace(/₹\{/g, '${'); // Ensure all template literals are fixed
      c = c.replace(/₹\//g, '$/'); // Regex ending edge cases

      if(og!==c){
        fs.writeFileSync(p,c);
        console.log('Fixed mongoose operator in',p);
      }
    }
  });
}
walk('c:/Users/nikhil.m/Documents/folder/backend');
