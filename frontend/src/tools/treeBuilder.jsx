// const classes = ["csc-120","csc-220","csc-270","csc-310","csc-320"];
// const data = [
//     {
//         current: "csc-120",
//         postreq: "csc-220"
//     },

//     {
//         current: "csc-220",
//         postreq: "csc-270"
//     },

//     {
//         current: "csc-270",
//         postreq: "csc-310"
//     },


//     {
//         current: "csc-270",
//         postreq: "csc-320"
//     },
// ]

function buildRoots(data, classes){
    const dataMap = {};

    data.map((item)=>{
        if(!dataMap[item.current]){
            dataMap[item.current] = [];
        }
        dataMap[item.current].push(item.postreq);
        
    })

    const roots = [];

    classes.map((item)=>{
        if(!dataMap[item]){
            roots.push(item);
        }
    })

    return roots;
}

function buildTree(data,classes){
    const roots = buildRoots(data,classes)

    // console.log("This is the datamap:",dataMap)
    // console.log("These are the roots:",roots)

    let q = [...roots];
    const tree = [];
    const visited = new Set();
    while (q.length > 0){
        const node = q.pop();
        const children = [];
        data.forEach((item)=>{
            if(item.postreq == node){
                children.push(item.current);
                q.push(item.current);
            }
        })
        const add = {
            val: node,
            children: children
        }
        if(!visited.has(add.val)){
            tree.push(add);
            visited.add(add.val);
        }
        
    }   
    console.log(tree)
    return tree;
}

function findPreReqs(data,classes,value){

    const roots = buildRoots(data,classes);
    const tree = buildTree(data,classes);

    const visited = new Set();

    let q = [];
    roots.map((root)=>{
        tree.map((node, index)=>{
            if(root == node.val){
                q.push(tree[index]);
            }
        })
    })

    const treeMap = {};

    tree.forEach(node => {
        treeMap[node.val] = node;
    });
 
    let record = false;
    const prereqs = [];
    while (q.length > 0){

        const current = q.shift();

        if(current.val == value){
            q = [];
            record = true;
        }

        for (let i = 0; i<current.children.length; i++){
            const childVal = current.children[i];
            if(!visited.has(childVal)){
                q.push(treeMap[childVal]);
                visited.add(childVal);
                if(record){
                    prereqs.push(treeMap[childVal].val);
                }
            }
        }
    }   
    return prereqs;
}

export { buildRoots, buildTree, findPreReqs };