const Discord = require('discord.js');
const {Client, Attachment} = require('discord.js');
const Twitter = require('twitter');
//const Guild = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

require("dotenv").config(); //add enviromental variables
const twitter_client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
  console.log('Bot je zagnan');
});

client.login(process.env.DISCORD_LOGIN_TOKEN);

////////////////////////////////////////////////////////////////////////////////////////////////

// Create an event listener for messages
client.on('message', message => {

	if(message.content.includes('znanj') && message.author.id != 507581624301649951) {
		message.channel.send('Je kdo rekel znanje? \n Poglej na našo spletno učilnico! \n eucilnica.eznanje.net');
	}
	if(message.content == '--stop'){
		message.channel.send("ok :c");
		client.destroy();
	}
	
	if(message.content == '--my id' || message.content == '--myid' || message.content == '--id') {
		message.reply(message.author.id);
	}

	if(message.content == '--oj') {
		message.channel.send('kaj češ?????????????????????????????????????????????????????????????????????');
	}
	if(message.content == 'kaj češ?????????????????????????????????????????????????????????????????????' && message.author.id == 507581624301649951) {
		message.edit('kaj je');
	}

	if(message.content == '--jansa'){
		twitter_client.get('https://api.twitter.com/2/users/258856900/tweets?expansions=referenced_tweets.id&max_results=5&exclude=replies', (error, tweets, response) => {
			if(error) throw error;
			if (tweets.data[0].referenced_tweets){
				let id_url = 'https://api.twitter.com/2/tweets/'+tweets.data[1].referenced_tweets[0].id;
				twitter_client.get(id_url, (err, tweet, res) => {
					if(err) throw err;
					message.channel.send(tweet.data.text);
				});
			}
			else{
				message.channel.send(tweets.data[0].text);
			}
		});
	}

	if(message.content == '--art' && message.author.id != '507581624301649951') {
		const attachment = new Attachment('art.jpg');
		message.channel.send(attachment);
	}

	if((message.content == '--profile' || message.content == '--myprofile') && message.author.id != '507581624301649951'){
		const attachment = new Attachment('https://cdn.discordapp.com/avatars/'+message.author.id+'/'+message.author.avatar+'.png')
		message.channel.send(attachment);
	}

	if(message.content == "--help" || message.content == "--pomoč") {
		str = "";
		str += "All commands:\n\n";
		str += "**--my id** \n      - izpiše tvoj id\n";
		str += "**@someone** \n      - mentiona random memberja\n";
		str += "**--roles** \n      - izpiše vse role\n      - če napišeš zraven me, bo izpisalo tvoje role\n      - če napišeš zraven ime uporabnika, bo izpisalo njegove role";
		str += "**--voiceinfo** \n      - pove informacije o voice channelu, v katerem si trenutno\n";
		str += "**--joindate** \n      - pove kdaj si se joinal temu serverju\n";
		message.channel.send(str);
	}
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

	if(message.content == '@someone') {
		let random_member = message.guild.members.random().id;
		message.channel.send('<@'+random_member+'>');
	}

	if(message.content == '--minusminus') {
		let ran = message.guild.members.random().user;
		let rand = ran.bot;
		if(rand == true) {
			message.channel.send(ran.username + ' je bot');
		}
		else {
			message.channel.send(ran.username + ' ni bot');
		}
	}

  	if(message.content.startsWith('--roles')) {
		let roles = ''
		if(message.content == '--roles') {
			for(i=0; i<message.guild.roles.array().length; i++) {
				let role = message.guild.roles.array()[i].name;
				if(!role.startsWith('@')) {
					if(i!=0) {
						roles = roles + role+'\n';
					}
					else {
						let roles = role+'\n';
					}
				}
			}
			message.channel.send('Vsi roli: \n'+roles);
		}
		else if(message.content == '--roles me') {
			console.log(message.guild.members.array())
			for(i=0; i<message.guild.members.array().length; i++) {
				if(message.guild.members.array()[i].id == message.author.id) {
					for(j=0; j<message.guild.members.array()[i]._roles.length; j++) {
						let role = message.guild.roles.find('id', message.guild.members.array()[i]._roles[j]);
						if(j!=0) {
							roles = roles + role.name+'\n';
						}
						else {
							roles = role.name+'\n';
						}
					}
					message.channel.send('Tvoji roli so: \n'+roles);
					break;
				}
			}
		}
		else {
			let temp = message.content.split(" ");
			temp[0] = '';
			let person = temp.join(" ");
			person = person.substring(1);
			person = person.toLowerCase();
			let personOutput;

			for(i=0; i<message.guild.members.array().length; i++) {
				if(message.guild.members.array()[i].user.username.toLowerCase() == person) {
					for(j=0; j<message.guild.members.array()[i]._roles.length; j++) {
						let role = message.guild.roles.find('id', message.guild.members.array()[i]._roles[j]);
						if(j!=0) {
							roles = roles + role.name+'\n';
						}
						else {
							let roles = role.name+'\n';
						}
					}
					personOutput = message.guild.members.array()[i].user.username
					message.channel.send(personOutput+' ima te role: '+'\n'+roles);
					break;
				}
			}
		}
  	}

  	if(message.content == '--deletethis') {
  		message.delete();
  	}

  	if(message.content == '--voiceinfo') {
		if(message.member.voiceChannel != undefined) {
			message.channel.send('Ime: '+ message.member.voiceChannel.name + '\nID: '+ message.member.voiceChannel.id + '\nBitrate: '+message.member.voiceChannel.bitrate + '\nTimeout time: ' + message.member.voiceChannel.guild.afkTimeout/60 + ' min');
		}
		else {
			message.channel.send('Nisi v nobenem channelu');
		}
  	}

  	if(message.content == '--joindate') {
		const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
		let jointime = message.member.joinedTimestamp;
		let joindate = new Date(jointime);
		joindate = joindate.toLocaleString("en-US", options);
		console.log(joindate);
		message.channel.send(joindate);
  	}

  	if(message.content == '--joindate japan') {
		let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
		let jointime = message.member.joinedTimestamp;
		let joindate = new Date(jointime);
		let joindateS = joindate.toLocaleString("jp-US", options);
		let joinDate = joindateS.split(" ");

		message.channel.send(joindateS);
  	}
  	
 	if(message.content == '--id channel'){
		message.channel.send(message.channel.id);
	}

});

function random(min, max) {
	min = Math.floor(min);
	max = Math.floor(max);
	return Math.floor(Math.random()*(max-min+1)+min);
}



