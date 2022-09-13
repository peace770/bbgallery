/*fetch('http://data.nba.net/data/10s/prod/v1/2019/players.json')
.then((data) => {
    console.log(data);
	let a =  data.json();
    console.log(a);
})
.catch((e) => {
    console.log(e);
});*/

let container = document.querySelector(".container");
let pos = document.querySelector("#pos");
let playerList =[];
render();

function render(){
    let year = document.querySelector("#year");
    axios.get('http://data.nba.net/data/10s/prod/v1/'+ year.value +'/players.json')
    .then((res)=>{
		playerList = res.data.league.standard;
        console.log(res);
		let poslist = getUniqueValues(playerList, "pos");
		buildSelect(poslist, "#pos");
    })
    .catch((error) => {
        console.log(error);
    });
}

const getUniqueValues =(list, key)=>{
    let arr = Array();
	list.forEach((player) => {
		if (!arr.includes(player[key])) {
			arr.push(player[key]);
		}
	});
	console.log(arr);
}

const buildSelect =(list, parent) => {
    let select = document.querySelector(parent);
	select.innerHTML = "";
	list.forEach((Pos) =>{
		let temp = buildelement("option", "positem", null, pos, null, select);
		temp.value = pos;
	})
}

let filterByName = (first, last) => {
	let filter = playerList.filter((p) => {
		return p.firstName == first && p.lastName == last;
	});
	return filter[0];
};

let filterByTeamId = (teamId) => {
	let filteredPlayerList = playerList.filter((player) => {
		return player.teamId == teamId;
	});
	return filteredPlayerList;
};

let buildElement = (tag, cls, id, text, html, parent, src) => {
	if(typeof(tag) == "string"){
		let t = document.createElement(tag);
		if(Array.isArray(cls)){
			cls.forEach((c) => {
				t.classList.add((typeof(c) == "string")? c : "");
			});
		} else if(typeof(cls) == "string"){
			t.classList.add(cls);
		}
		t.id = (typeof(id) == "string")? id : "";
		if(typeof(text) == "string"){
			t.textContent = text;
		} else if(typeof(html) == "string"){
			t.innerHTML = html;
		}
		if(typeof(parent) == "object"){
			parent.appendChild(t);
		} 
		if(tag == "img" && typeof(src) == "string"){
			t.src = src;
		}
		return t;
	} else {
		return null;
	}
};

let buildGallery = (list, parent) => {
	parent.innerHTML = "";
	for(let i = 0; i < list.length; i++){
		let card = buildElement("div", ["card","centeredFlex"],null,null,null, parent,null);
		let child = buildElement("div", "name", null, null, null, card, null);
		buildElement("p", "name", null, list[i].firstName + " " + list[i].lastName, null, child, null);

		child = buildElement("div", "picture", null, null, null, card, null);
		buildElement("img", null, null, null, null, child, "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/" + list[i].personId + ".png");

		child = buildElement("div", "details", null, null, null, card, null);
		child = buildElement("ul", null, null, null, null, child, null);
		buildElement("li", null, null, "Position: " + list[i].pos, null, child, null);
		buildElement("li", null, null, "Jersy: " + list[i].jersey, null, child, null);
	}
}

const viewGallery = () => {
	let filteredPlayerList =playerList.filter((player) => {
		return player.pos == select.value;
	}); 
	buildGallery(filteredPlayerList, container);
};


