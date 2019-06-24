const Discord = require("discord.js");
const mysql = require("mysql");
const prefix = "!";

const bot = new Discord.Client({disableEveryone: true})


var con_fig = {
	host: "us-cdbr-iron-east-02.cleardb.net",
	user: "b15670f08b7708",
	password: process.env.MY_SQL,
	database: "heroku_7c877bc06bc2d8f",
	port: 3306
};

var con;

function handleDisconnect() {
con = mysql.createConnection(con_fig);
con.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  }); 	

process.on('uncaughtException', function (err) {
    console.log(err);
	
}); 
	


con.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
       throw err;                                 // server variable configures this)
    }
});
       }
handleDisconnect();

bot.on('guildMemberAdd', member => {

    


member.guild.channels.get("592801832364146721").send(`${member} Hi! reply with **!user** to create an alkahestry account!`);


});

bot.on('guildMemberRemove', member => {

	


con.query(`SELECT * FROM user WHERE id = '${member.user.id}'`, (err, rows) => {
		if(err) throw err;
		let sql;
		
		if(rows.length < 1) {
			
			return;
		} else {
			sql = `DELETE FROM user WHERE id = '${member.user.id}'`;
			con.query(sql, console.log);
			member.guild.channels.get("592801832364146721").send(`${member} 's alkahestry account has been deleted!`);
		}

	});			
   	


});

bot.on("ready", async () => {



	console.log(`${bot.user.username} is ready!`);
	
	bot.user.setPresence({ status: 'online', game: { name: '!help' } });



	try {

		let link = await bot.generateInvite(["ADMINISTRATOR"]);

		console.log(link);

	}	catch(e) {

		console.log(e.stack);

	}
//


});

bot.on("message", async message => {
    
    let messageArray = message.content.split(" ");

    let command = messageArray[0];

    let args = messageArray.slice(1);

    
    


    


        
    
    
    if(message.author.bot) return;
	
//dev commands	
	
    if(command === `!table`){
	if(message.author.id == '242118931769196544'){
		var sql = "CREATE TABLE user (id VARCHAR(30), points BIGINT, bio VARCHAR(100), hue VARCHAR(7))";  
		
	con.query(sql, function (err, result) {
    	if (err) throw err;
    	message.author.send("**user** table created!");
  	});
		
	}	
    }
	
	if(command === `!drop`){
	if(message.author.id == '242118931769196544'){
	var sql = "DROP TABLE user";
  	con.query(sql, function (err, result) {
    	if (err) throw err;
    	message.author.send("Table dropped for **user**!");
  	});
  
	}
	}	
	
    if(message.channel.type === "dm") return;

if(command === `${prefix}help`){

        message.channel.send(`Greetings, ${message.author}`);
                 



         return;



    }
	
function addUser(){
		
		con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {
		if(err) throw err;
		let sql;
		if(rows.length < 1) {
			
			sql = `INSERT INTO user (id, points, bio, hue) VALUES ('${message.author.id}', ${0}, '!bio to set your bio', '#4286f4')`;
			con.query(sql, console.log);
			message.channel.send(`User account created! !view to view your account!`)
			return;
		}	else {

			message.reply(` You have a user! Do !view to see your user`);
			

			
			return;
		}


		});
		
	}
	
function viewUser(){
		
con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {
		if(err) throw err;

		if(rows.length < 1) {
			message.reply(`You have no user! \n Type !user to create one!`);
			
			return;
		}

		let points = rows[0].points;
		let bio = rows[0].bio;
		let color = rows[0].hue;
		

		

		let stats = new Discord.RichEmbed()

			
			.setAuthor(message.author.username)
			.setDescription("Points: $" + points + "\n" + bio)
			.setFooter("ID:" + message.author.id, message.author.avatarURL)
			.setColor(color); 

		message.channel.sendEmbed(stats);


		
		

	});

}
	
function viewOtherUser(){
	let other = message.mentions.users.first();	
con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {
		if(err) throw err;

		if(rows.length < 1) {
			message.reply(`They have no user! \n Type !user to create one!`);
			
			return;
		}

		let points = rows[0].points;
		let bio = rows[0].bio;
		let color = rows[0].hue;
		

		

		let stats = new Discord.RichEmbed()

			
			.setAuthor(message.author.username)
			.setDescription("Points: $" + points + "\n" + bio)
			.setFooter("ID:" + other.id, other.avatarURL)
			.setColor(color); 

		message.channel.sendEmbed(stats);


		
		

	});

}	
	
function deleteUser(){

con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {
		if(err) throw err;

		let sql;
		if(rows.length < 1) {
			message.reply(`You have no user! \n Type !user to create one!`);
			
			return;
		} else {
			sql = `DELETE FROM user WHERE id = '${message.author.id}'`;
			con.query(sql, console.log);
			message.reply(`User Deleted! !user to create a new one!`);
		}

	});
	return;
}

function give(){
	let other = message.mentions.users.first();
	var num = parseInt(messageArray[2]); 

	con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {

		if(err) throw err;
		let sql;
		
		
		
		
		if(message.author.id != other.id && num > 0){
			
			con.query(`SELECT * FROM user WHERE id = '${other.id}'`, (err, rows) => {
				if(err) throw err;
				let sql;
				
		
		
				
				if(rows.length < 1) {
					message.reply(`They have no user! \n Type !user to create one!`);
			
				return;
				}
				var points = rows[0].points;
				sql = `UPDATE user SET money = ${points + num} WHERE id = '${other.id}'`;
				console.log("Received $" + num);
				con.query(sql, console.log);
				message.reply(`gave ${other} ` + num + ` points!`);
	});	
		} else{
			message.reply("Invalid amount to give.");
		}
	});

	

	return;
}		
	
function take(){
	let other = message.mentions.users.first();
	var num = parseInt(messageArray[2]); 

	con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {

		if(err) throw err;
		let sql;
		
		
		
		
		if(message.author.id != other.id && num > 0){
			
			con.query(`SELECT * FROM user WHERE id = '${other.id}'`, (err, rows) => {
				if(err) throw err;
				let sql;
				
		
		
				
				if(rows.length < 1) {
					message.reply(`They have no user! \n Type !user to create one!`);
			
				return;
				}
				var points = rows[0].points;
				sql = `UPDATE user SET money = ${points - num} WHERE id = '${other.id}'`;
				console.log("Lost $" + num);
				con.query(sql, console.log);
				message.reply(`took ${other} ` + num + ` points!`);
	});	
		} else{
			message.reply("Invalid amount to take.");
		}
	});

	

	return;
}			
	
function viewLocalboard(){
con.query(`SELECT * FROM user`, (err, rows) => {
		if(err) throw err;
	
	
let rank = [];

function serverList(users, index){	
	

		var person = bot.users.get(rows[index].id);
		var funds = rows[index].points;
		var acc = {tname: person.username, points: funds};
		if (message.guild.member(rows[index].id)) {
 			 // there is a GuildMember with that ID
			rank.push(acc);
		} else {
			console.log(person.username + " isn't in this server");
			
		}
		
		
}

	rows.forEach(serverList);	
	rank.sort(function(a, b){return b.points - a.points});
	var filler = {tname: "Insert Name Here", points: 0};
if(rank.length < 10){
	rank.push(filler, filler, filler, filler, filler, filler, filler, filler, filler, filler);
}	
		
			
		
let leaderboard = new Discord.RichEmbed()
		
			
			.setTitle(message.guild.name + "'s point Leaderboard")
			.setDescription("1. `" + rank[0].tname + "`\n Pts:" + rank[0].points + "\n 2.`" + rank[1].tname + "`\n Pts:" + rank[1].points + "\n 3.`" + rank[2].tname + "`\n Pts:" + rank[2].points + "\n 4.`" + rank[3].tname + "`\n Pts:" + rank[3].points + "\n 5.`" + rank[4].tname + "`\n Pts:" + rank[4].points + "\n 6.`" + rank[5].tname + "`\n Pts:" + rank[5].points + "\n 7.`" + rank[6].tname + "`\n Pts:" + rank[6].points + "\n 8.`" + rank[7].tname + "`\n Pts:" + rank[7].points + "\n 9.`" + rank[8].tname + "`\n Pts:" + rank[8].points + "\n 10.`" + rank[9].tname + "`\n Pts:" + rank[9].points)
			.setColor("#00fffa"); 

		message.channel.sendEmbed(leaderboard);
			
		
		
		


		
	

	});

}	
	
function bio(){


con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {
		if(err) throw err;

		if(rows.length < 1) {
			message.reply("You have no user! Type !user to create one!");
			
			return;
		}

		
		let bio = rows[0].bio;
		message.channel.send("Update your bio! You have 100 characters. \n !cancel to cancel.");
				
		
		const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 100000000 });
        		collector.once('collect', message => {
            		if (message.content == `!cancel`) {
               		 message.channel.send("Message cancelled.");
                		return;
            		} else {
				
				sql = `UPDATE user SET bio = "${message.content}" WHERE id = '${message.author.id}'`;
				con.query(sql);
				message.author.send("Bio Updated!");
			}
			});

		
		

	});

}
	
function hexcolor(){


con.query(`SELECT * FROM user WHERE id = '${message.author.id}'`, (err, rows) => {
		if(err) throw err;

		if(rows.length < 1) {
			message.reply("You have no user! Type KS!help for a list of commands!");
			
			return;
		}

		
		let color = rows[0].hue;
		
		
			message.channel.send("Update your profile color! Send the hexidecimal code for your profile. \n !cancel to cancel.");
				

		
		const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 100000000 });
        		collector.once('collect', message => {
            		if (message.content == `!cancel`) {
               		 message.channel.send("Message cancelled.");
                		return;
            		} else {
				
				sql = `UPDATE user SET hue = '${message.content}' WHERE id = '${message.author.id}'`;
				con.query(sql);
				message.author.send("Color Updated!");
			}
			});

		
		

	});

}	

if(command === `!help`){
		let help = new Discord.RichEmbed()

			
			.setTitle("KS-Bot commands")
			.setDescription(`**!help**: \n Pulls up this list. \n **!user**: \n Creates a point account  \n **!view [mention]**: \n Views another persons account info. \n **!delete**: \n Deletes your account. \n **$!bio**: \n Sets a bio for your account. \n **!color**: \n Sets a color for your bio. \n ***__ADMIN/MOD ONLY__*** : \n **!give [mention] [amount]**: \n Gives a user an amount of points. \n **!takes [mention] [amount]**: \n Takes away an amount of points from a user.`)
			.setColor("#1d498e"); 

		message.author.sendEmbed(help);
		message.reply(" sent you a dm of the help list!");
}	
	

if(command === `!user`){

		addUser();
		 



		 return;



	}

	if(command === `!delete`){


		deleteUser();
		

			

		 return; 

		

		

	}

	if(command === `!leaderboard`){
		

		viewLocalboard();
	

		 return; 	

} 
	
if(command === `!view` && messageArray[1] === undefined){
	viewUser();
}	
	
if(command === `!view` && messageArray[1] != undefined ){
	viewOtherUser();		
}	
	
if(command === `!give`){
		
if(message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.find("name", "Mod")){
		give();
	}		else {
		message.reply(" You don't have the credentials to perform this function.");
		return;
	}


} 	
	
if(command === `!take`){
		

		if(message.author.id == message.guild.ownerID || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.find("name", "Mod")){
		take();
	}		else {
		message.reply(" You don't have the credentials to perform this function.");
		return;
	}
	

} 	
	
if(command === `!bio`){
		

		bio();
	

		 return; 	

} 

if(command === `!color`){
		

		hexcolor();
	

		 return; 	

}	

    });    
bot.login(process.env.BOT_TOKEN);
