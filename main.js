const express=require('express');
const app=express();
const port=3000;
const fs=require('fs');
const multer=require('multer');
const ejs=require('ejs');
app.use(express.json());


app.use(express.static(__dirname + '/public'));
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("uploads"));
app.set("view engine","ejs")

const storage = multer.diskStorage({
    destination: function(req, file , callback)
    {
      if(req.path === "/")
      {
        callback(null, "uploads")
      }
      else
      {
        callback(null, "uploads")
      }
    },
    filename: function(req, file , callback)
    {
      callback(null, file.originalname);
    },
  })
  
  const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file , callback)
    {
      console.log(file)
     
        callback(null, true);
     
    }, 
  })


  app.post("/delete",(req,res)=>{
    var c=req.body.it;
    let todos=[];
    fs.readFile("./data.json","utf-8",function(err,data){
     
      todos=JSON.parse(data);
      console.log(todos);
  for(var i=0;i<todos.length;i++){
    console.log(JSON.stringify(todos[i].name)+" "+JSON.stringify(c))
  if(JSON.stringify(todos[i].name)===JSON.stringify(c)){
  todos.splice(i,1);
    break;
  }
  }
  fs.writeFile("./data.json",JSON.stringify(todos),function(err){
  if(err)
  console.log("error found");
  else
  console.log("success ")
  
  })
  
    })
    
      res.render("index",{todos});
   /// res.redirect("/");
    
  })


  app.post("/read",(req,res)=>{
		var c=req.body.it;
    let todos = [];
		fs.readFile("./data.json", "utf-8" ,function(err, data)
	{
		

		if(data.length > 0)
		{
			todos = JSON.parse(data);
		}
for(var i=0;i<todos.length;i++){
if(todos[i].name==c){
	todos[i].isComplete=true;
	break;
}
}
		

fs.writeFile("./data.json",JSON.stringify(todos),function(err){
	if(err)
	console.log("error occured");
	else
	console.log("done");
	
	
})

})

  res.render("index",{todos});


	})

  app.get("/", function(req, res)
  { 

    fs.readFile("./data.json", "utf-8", function(err, data)
    {
        let todos=[];
        if(data.length>0){
            todos=JSON.parse(data);
        }
      res.render("index",{todos});
    
    })
  })

app.post("/", upload.single("pic"), function(req, res)
{


    var name=req.body.item;
	   console.log(name+" "+req.file);

fs.readFile("./data.json","utf-8",function(err,data){
let todos=[];
if(data.length>0){
	todos=JSON.parse(data);
}

todos.push({name:name,url:req.file.filename,isComplete:false});

console.log(req.body);
fs.writeFile("./data.json",JSON.stringify(todos),function(err){
if(err){
	console.log("error");
}
else{
	console.log("success");

}
console.log(todos);

	res.render("index.ejs",{todos});
})
})


  console.log(req.file);

  
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})