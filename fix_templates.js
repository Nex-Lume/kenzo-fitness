const fs=require('fs');
const path=require('path');

function walk(d){
  fs.readdirSync(d).forEach(f=>{
    const p=path.join(d,f);
    if(fs.statSync(p).isDirectory()){
      if(f!=='node_modules'&&f!=='.git') walk(p);
    } else if(p.endsWith('.js')||p.endsWith('.jsx')){
      let c=fs.readFileSync(p,'utf8');
      const og=c;
      c=c.replace(/₹\{/g,'${');
      
      // Also update plan prices in seed.js specifically if we find it
      if (p.includes('seed.js')) {
          c = c.replace(/price: 29/g, 'price: 1500');
          c = c.replace(/price: 49/g, 'price: 2500');
          c = c.replace(/price: 199/g, 'price: 10000');
      }

      if(og!==c){
        fs.writeFileSync(p,c);
        console.log('Reverted template literal / updated prices in',p);
      }
    }
  });
}
walk('c:/Users/nikhil.m/Documents/folder');
