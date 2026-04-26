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


// const classes = [
//         {header:"MTH-123",class_id:9},
//         {header:"MTH-125",class_id:10},
//         {header:"MTH-141",class_id:11},
//         {header:"CSC-120",class_id:1},
//         {header:"CSC-220",class_id:2},
//         {header:"CSC-270",class_id:3},
//         {header:"CSC-310",class_id:4},
//         {header:"CSC-320",class_id:5},
//         {header:"CSC-360",class_id:6},
//         {header:"CSC-491",class_id:7},
//         {header:"CSC-492",class_id:8},
//     ]
// //         // {header:"CSW-123",class_id:12},
// //         // {header:"CSW-223",class_id:13},
// //         // {header:"CSW-423",class_id:14}];

//     const prerequisiteMapping = [
//         {current:2, prerequisite:1},
//         {current:3, prerequisite:1},
//         {current:4, prerequisite:2},
//         {current:5, prerequisite:2},
//         {current:5, prerequisite:10},
//         {current:5, prerequisite:11},
//         {current:6, prerequisite:2},
//         {current:6, prerequisite:3},
//         {current:8, prerequisite:7},
//     ]

 const findPostrequisites = (prerequisiteMapping) =>{
    const postRequisiteMapping = []
    prerequisiteMapping.forEach((item)=>{
        postRequisiteMapping.push({
            current:item.prerequisite_class_id,
            postrequisite:item.class_id
        })
    })
    return postRequisiteMapping;
}

const convertPostrequisitesToHeaders = (postRequisiteMapping,classes)=>{
    const postrequisiteHeaders = []
    postRequisiteMapping.map((postreqItem)=>{
        let current = -1;
        let postrequisite = -1;
        classes.forEach((classItem)=>{
            if(postreqItem.current === classItem.class_id){
                current = classItem.header;
            }
            if(postreqItem.postrequisite === classItem.class_id){
                postrequisite = classItem.header;
            }
        })

        if(current !== -1 && postrequisite !== -1){
            postrequisiteHeaders.push({
                current: current,
                postrequisite: postrequisite
            })
        }
    })

    return postrequisiteHeaders;
}

function buildRoots(postRequisiteHeaders, classes){
    const dataMap = {};

    postRequisiteHeaders.map((item)=>{
        if(!dataMap[item.current]){
            dataMap[item.current] = [];
        }
        dataMap[item.current].push(item.postreq);
        
    })

    const roots = [];

    classes.map((item)=>{
        if(!dataMap[item.header]){
            roots.push(item.header);
        }
    })

    return roots;
}

//const roots = buildRoots(postrequisiteHeaders,classes)

// console.log("postrequisites: ",postrequisites)
// console.log("postrequisiteHeaders: ",postrequisiteHeaders)
// console.log("roots: ",roots)


function buildTree(prerequisiteMapping,classes){
    const postrequisites = findPostrequisites(prerequisiteMapping)
    const postrequisiteHeaders = convertPostrequisitesToHeaders(postrequisites,classes);
    const roots = buildRoots(postrequisiteHeaders,classes)

    // console.log("This is the datamap:",dataMap)
    // console.log("These are the roots:",roots)

    let q = [...roots];
    const tree = [];
    const visited = new Set();
    while (q.length > 0){
        const node = q.pop();
        const children = [];
        postrequisiteHeaders.forEach((item)=>{
            if(item.postrequisite == node){
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
    //console.log(tree)
    return tree;
}

//console.log(buildTree(postrequisiteHeaders,classes))

function findPreReqs(prerequisiteMapping,classes,value){

    const postrequisites = findPostrequisites(prerequisiteMapping)
    const postrequisiteHeaders = convertPostrequisitesToHeaders(postrequisites,classes);

    const roots = buildRoots(postrequisiteHeaders,classes);
    const tree = buildTree(prerequisiteMapping,classes);

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
                //visited.add(childVal);
                if(record){
                    prereqs.push(treeMap[childVal].val);
                }
            }
        }
    }   
    return prereqs;
}

//console.log(findPreReqs(postrequisiteHeaders,classes,"CSC-492"))

export {findPreReqs}

// function buildRoots(data, classes){
//     const dataMap = {};

//     data.map((item)=>{
//         if(!dataMap[item.current]){
//             dataMap[item.current] = [];
//         }
//         dataMap[item.current].push(item.postreq);
        
//     })

//     const roots = [];

//     classes.map((item)=>{
//         if(!dataMap[item]){
//             roots.push(item);
//         }
//     })

//     return roots;
// }

// function buildTree(data,classes){
//     const roots = buildRoots(data,classes)

//     // console.log("This is the datamap:",dataMap)
//     // console.log("These are the roots:",roots)

//     let q = [...roots];
//     const tree = [];
//     const visited = new Set();
//     while (q.length > 0){
//         const node = q.pop();
//         const children = [];
//         data.forEach((item)=>{
//             if(item.postreq == node){
//                 children.push(item.current);
//                 q.push(item.current);
//             }
//         })
//         const add = {
//             val: node,
//             children: children
//         }
//         if(!visited.has(add.val)){
//             tree.push(add);
//             visited.add(add.val);
//         }
        
//     }   
//     console.log(tree)
//     return tree;
// }

// function findParams(data,classes,value){
//     const roots = buildRoots(data,classes)
//     const tree = buildTree(data,classes);


//     const visited = new Set();

//     const treeMap = {};

//     tree.forEach(node => {
//         treeMap[node.val] = node;
//     });
 
//     let height = 0;
//     let q = roots.map(val => treeMap[val]);

//     // const treeMap = {};

//     // tree.forEach(node => {
//     //     treeMap[node.val] = node;
//     // });
    
//     //bfs starts
//     while (q.length > 0){
//         const currentSize = q.length;
//         let width = 0;
//         for (let i = 0 ; i< currentSize; i++){
//             const current = q.shift();
//             current.height = height;
//             current.width = width;
//             width += 1;
//             for (let j = 0 ; j < current.children.length; j++){
//                 const childVal = current.children[j];
//                 if(!visited.has(childVal)){
//                     q.push(treeMap[childVal]);
//                     visited.add(childVal);
//                 }
//             }
//         }
//         height+=1;
//     }

//     return tree;

// }

// function findPreReqs(data,classes,value){

//     const roots = buildRoots(data,classes);
//     const tree = buildTree(data,classes);

//     const visited = new Set();

//     let q = [];
//     roots.map((root)=>{
//         tree.map((node, index)=>{
//             if(root == node.val){
//                 q.push(tree[index]);
//             }
//         })
//     })

//     const treeMap = {};

//     tree.forEach(node => {
//         treeMap[node.val] = node;
//     });
 
//     let record = false;
//     const prereqs = [];
//     while (q.length > 0){

//         const current = q.shift();
        
//         if(current.val == value){
//             q = [];
//             record = true;
//         }

//         for (let i = 0; i<current.children.length; i++){
//             const childVal = current.children[i];
//             if(!visited.has(childVal)){
//                 q.push(treeMap[childVal]);
//                 //visited.add(childVal);
//                 if(record){
//                     prereqs.push(treeMap[childVal].val);
//                 }
//             }
//         }
//     }   
//     return prereqs;
// }

// export { buildRoots, buildTree, findPreReqs, findParams };