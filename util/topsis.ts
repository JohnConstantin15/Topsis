import { country, lifetime, material, mechanism } from "../data/default";
import { Watch } from "../data/watches";

export default function (watches: Watch[], localCoefs: any) {
    const coefs = watches.map(x => [
        x.price,
        localCoefs[x.material] || material[x.material] || 0,
        localCoefs[x.lifetime] || lifetime[x.lifetime] || 0,
        x.populirity,
        x.support,
        localCoefs[x.mechanism] || mechanism[x.mechanism] || 0,
        x.waterResist,
        localCoefs[x.origin] || country[x.origin] || 0,
    ])
    let l=Array(coefs[0].length).fill(0)
    let d=Array(coefs[0].length).fill(0)
    for (let j = 0; j < coefs[0].length; j++) {
        for (let i = 0; i < coefs.length; i++) {
            l[j]+=coefs[i][j]*coefs[i][j]
            
        }
        for (let i = 0; i < coefs.length; i++) {
            d[j]=Math.sqrt(l[j])
            
        }
        
    }
    let maxR=Array(coefs[0].length).fill(0)
    let minR=Array(coefs[0].length).fill(0)
    const r=[...coefs]
    for (let j = 0; j < coefs[0].length; j++) {
        let max=1
        let min=0
        for (let i = 0; i < coefs.length; i++) {
            r[i][j]=coefs[i][j]/d[j]
            if(max<r[i][j]){
                max=r[i][j]
            }
            if(min>r[i][j]){
                min=r[i][j]
            }
            
        }
        maxR[j]=max
        minR[j]=min
    }
    let sPlus=Array(coefs.length).fill(0)
    let sMinus=Array(coefs.length).fill(0)
    for (let i = 0; i < coefs.length; i++) {
     for (let j = 0; j < coefs[0].length; j++) {
        sPlus[i]+=(r[i][j]-maxR[j])*(r[i][j]-maxR[j])
        sMinus[i]+=(r[i][j]-minR[j])*(r[i][j]-minR[j])
     }
     sPlus[i]=Math.sqrt(sPlus[i])
     sMinus[i]=Math.sqrt(sMinus[i])
     
    }
    let k=Array(coefs.length).fill(0)
    for (let i = 0; i < coefs.length; i++) {
            k[i]=sMinus[i]/(sMinus[i]+sPlus[i])
        
    }
    return k

}