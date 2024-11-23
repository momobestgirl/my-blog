import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("public"));
app.set('view engine','ejs');

console.log(new Date().toString());

let posts = [
        { date: 'September 9, 2016',
            title: 'Test Blog',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed ante id mi ullamcorper aliquet. Suspendisse ipsum orci, molestie nec odio ac, placerat aliquet odio. Sed posuere, urna nec scelerisque vulputate, risus nibh condimentum mi, quis scelerisque eros dui vel tellus. Pellentesque pharetra fringilla nunc, sed feugiat nunc ullamcorper porttitor. Nulla facilisi. In sed metus vel dui auctor sollicitudin ut vel orci. Pellentesque pulvinar augue vitae dolor tincidunt malesuada. Cras aliquam condimentum rhoncus.'
    }, { 
        date: 'January 2, 2022',
        title: 'SCOTT STEINER MATH',
        content: "YOU KNOW THEY SAY ALL MEN ARE CREATED EQUAL. BUT YOU LOOK AT ME AND YOU LOOK AT SOMOA JOE AND YOU CAN SEE THAT STATEMENT IS NOT TRUE! SEE NORMALLY IF YOU GO 1 ON 1 WITH ANOTHER WRESTLER YOU GOT A 50/50 CHANCE OF WINNING! BUT I'M A GENETIC FREAK AND I'M NOT NORMAL! SO YOU GOT A 25% AT BEST AT BEAT ME! AND THEN YOU ADD KURT ANGLE TO THE MIX, YOU THE CHANCES OF WINNING DRASTIC GO DOWN! SEE THE 3 WAY AT SACRIFICE YOU GOT A 33 1/3 CHANCE OF WINNING. BUT I, I GOT A 66 2/3 CHANCE OF WINNING CAUSE KURT ANGLE KNOWS HE CAN'T BEAT ME AND HE'S NOT EVEN GONNA TRY! SO SOMOA JOE YOU TAKE YOUR 33 1/3 CHANCE MINUS MY 25% CHANCE AND YOU GOT 8 1/3 CHANCE OF WINNING AT SACRIFICE. BUT THEN YOU TAKE MY 75% CHANCE OF WINNING IF WE WAS TO GO 1 ON 1 AND THEN ADD 66 2/3 %. I GOT A 141 2/3 CHANCE OF WINNING AT SACRIFICE! SENIOR JOE?THE NUMBERS DON'T LIE AND THEY SPELL DISASTER FOR YOU AT SACRIFICE!﻿"
    },

    {   
        date: 'May 19, 2024',
        title:'WE CAN DO THIS ALL NIGHT',
        content:'WE CAN DO THIS ALL NIGHT!!! WE CAN DO THIS ALL NIGHT!!! WE CAN DO THIS ALL NIGHT!!! WE CAN DO THIS ALL NIGHT!!! WE CAN DO THIS ALL NIGHT!!! WE CAN DO THIS ALL NIGHT!!! '
    }
];


// Home Page

app.get("/", (req,res) => {
    posts.sort((a,b) => {
        const dateA = parseDateString(a.date);
        const dateB = parseDateString(b.date);
        return dateB - dateA;
    });
    
    res.render("index.ejs", { posts });
});

// Viewing a single post

app.get("/post/:id", (req,res) => {
    const post = posts[req.params.id];
    if (post) {
        res.render("post.ejs",{ post, id: req.params.id });
    } else {
        res.status(404).send("Post not found my brothers");
    }
});

// Creating a post

app.get("/new", (req,res) => {
    res.render("new.ejs");
});

app.post("/new", (req,res) => {
    const newPost = {
        date: getFormattedDate(),
        title: req.body.title,
        content: req.body.content,
    }
    posts.push(newPost);
    res.redirect("/");
});

//Editing a post

app.get("/edit/:id", (req,res) => {
    const post = req.params.id;
    if (post) {
        res.render("edit.ejs", {post, id: req.params.id});
    } else {
        res.status(404).send("Post not found my brothers");
    }
});


app.post("/edit/:id", (req,res) => {
    const id = req.params.id;
    posts[id] = {
        title: req.body.title,
        content: req.body.content,
    }
});

//Deleting a post

app.post("/delete/:id", (req,res) => {
    posts.splice(req.params.id,1);
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`This server is listening to https://locahost:${port}`);
});


function getFormattedDate() {
    const date = new Date();
    const monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];
    const day = String(date.getUTCDate()).padStart(2,"0"); // Get day and ensure it's 2 digits
    const year = String(date.getFullYear());   

    return `${month} ${day}, ${year}`;
}

function parseDateString(dateStr) {
    const monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [month, day, year] = dateStr.split(" ");
    const monthIndex = monthNames.indexOf(month);
    const formattedDate = new Date(`${monthIndex + 1}/${day}/${year}`);

    return formattedDate;
}