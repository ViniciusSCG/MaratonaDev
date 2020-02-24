// configurando o servidor
const express =  require("express")
const server = express()

//configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({ extended: true}))


// configurar conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '2311',
    host: 'localhost',
    port: '5432',
    database: 'Doe'
})


// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})



// configurar apresentação da página
server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de banco de dados")

        const donors = result.rows
        return res.render("index.html",{ donors })
    })


    
})

server.post("/", function(req, res){
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }


    // coloco valores dentro do bd
    const query = 
        `INSERT INTO donors ("name", "email", "blood") 
         VALUES ($1, $2, $3)`
   
    const values = [name, email, blood]


    db.query(query, values, function(err){
        if(err) return res.send("erro no banco de dados.")
          

        return res.redirect("/")
    })


    

})

// ligar servidor e permitir acesso na porta 3000
server.listen(3000)