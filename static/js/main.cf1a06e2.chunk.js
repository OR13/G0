(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{1018:function(t,e){},1030:function(t,e){},1074:function(t,e){},1116:function(t,e){},1152:function(t,e){},1200:function(t,e){},1407:function(t,e){},1453:function(t,e){},1477:function(t,e){},1512:function(t,e){},1539:function(t,e){},1569:function(t,e){},1581:function(t,e){},1583:function(t,e){},1593:function(t,e){},1626:function(t,e){},1663:function(t,e){},1697:function(t,e){},1727:function(t,e){},1786:function(t,e){},1815:function(t,e){},1858:function(t,e){},1869:function(t,e){},1871:function(t,e){},1899:function(t,e){},1913:function(t,e){},1946:function(t,e){},2000:function(t,e){},2030:function(t,e){},2073:function(t,e,n){"use strict";n.r(e);var o=n(32),r=n.n(o),a=n(832),i=n.n(a),s=(n(838),n(110)),c=n(111),u=n(113),l=n(112),p=n(114),d=n(35),h=n.n(d),f=n(418),b=(n(842),n(132)),v=n.n(b),m=function t(e){this.current_color=t.BLACK,this.size=e,this.board=this.create_board(e),this.last_move_passed=!1,this.in_atari=!1,this.attempted_suicide=!1};m.EMPTY=0,m.BLACK=1,m.WHITE=2,m.prototype.create_board=function(t){for(var e=[],n=0;n<t;n++){e[n]=[];for(var o=0;o<t;o++)e[n][o]=m.EMPTY}return e},m.prototype.switch_player=function(){this.current_color=this.current_color===m.BLACK?m.WHITE:m.BLACK},m.prototype.pass=function(){this.last_move_passed&&this.end_game(),this.last_move_passed=!0,this.switch_player()},m.prototype.end_game=function(){console.log("GAME OVER")},m.prototype.play=function(t,e){if(console.log("Played at "+t+", "+e),window.ADD_DATA("Played at "+t+", "+e),this.attempted_suicide=this.in_atari=!1,this.board[t][e]!==m.EMPTY)return!1;var n=this.board[t][e]=this.current_color,o=[],r=this.get_adjacent_intersections(t,e),a=!1,i=this;return v.a.each(r,function(t){var e=i.board[t[0]][t[1]];if(e!==m.EMPTY&&e!==n){var r=i.get_group(t[0],t[1]);console.log(r),0===r.liberties?o.push(r):1===r.liberties&&(a=!0)}}),v.a.isEmpty(o)&&0===this.get_group(t,e).liberties?(this.board[t][e]=m.EMPTY,this.attempted_suicide=!0,!1):(v.a.each(o,function(t){v.a.each(t.stones,function(t){i.board[t[0]][t[1]]=m.EMPTY})}),a&&(this.in_atari=!0),this.last_move_passed=!1,this.switch_player(),!0)},m.prototype.get_adjacent_intersections=function(t,e){var n=[];return t>0&&n.push([t-1,e]),e<this.size-1&&n.push([t,e+1]),t<this.size-1&&n.push([t+1,e]),e>0&&n.push([t,e-1]),n},m.prototype.get_group=function(t,e){var n=this.board[t][e];if(n===m.EMPTY)return null;for(var o={},r=[],a=[[t,e]],i=0,s=function(t){var e=l.board[t[0]][t[1]];e===m.EMPTY&&i++,e===n&&a.push([t[0],t[1]])};a.length>0;){var c=a.pop();if(!o[c]){var u=this.get_adjacent_intersections(c[0],c[1]),l=this;v.a.each(u,s),o[c]=!0,r.push(c)}}return{liberties:i,stones:r}};var y=m,w=function(t){function e(){var t,n;Object(s.a)(this,e);for(var o=arguments.length,r=new Array(o),a=0;a<o;a++)r[a]=arguments[a];return(n=Object(u.a)(this,(t=Object(l.a)(e)).call.apply(t,[this].concat(r)))).handleClick=function(){n.props.board.play(n.props.row,n.props.col)&&n.props.onPlay()},n}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){var t={top:40*this.props.row,left:40*this.props.col},e="intersection";return this.props.color!==y.EMPTY&&(e+=this.props.color===y.BLACK?" black":" white"),r.a.createElement("div",{onClick:this.handleClick,className:e,style:t})}}]),e}(o.Component),_=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){for(var t=[],e=0;e<this.props.board.size;e++)for(var n=0;n<this.props.board.size;n++)t.push(r.a.createElement(w,Object.assign({key:"".concat(e,"-").concat(n)},{board:this.props.board,color:this.props.board.board[e][n],row:e,col:n,onPlay:this.props.onPlay})));var o={width:40*this.props.board.size,height:40*this.props.board.size};return r.a.createElement("div",{style:o,id:"board"},t)}}]),e}(o.Component),j=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){var t="";return this.props.board.in_atari?t="ATARI!":this.props.board.attempted_suicide&&(t="SUICIDE!"),r.a.createElement("div",{id:"alerts"},t)}}]),e}(o.Component),g=function(t){function e(){var t,n;Object(s.a)(this,e);for(var o=arguments.length,r=new Array(o),a=0;a<o;a++)r[a]=arguments[a];return(n=Object(u.a)(this,(t=Object(l.a)(e)).call.apply(t,[this].concat(r)))).handleClick=function(t){n.props.board.pass()},n}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement("input",{id:"pass-btn",type:"button",value:"Pass",onClick:this.handleClick})}}]),e}(o.Component),O=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(c.a)(e,[{key:"componentWillMount",value:function(){this.setState({board:this.props.board})}},{key:"onBoardUpdate",value:function(){this.setState({board:this.props.board})}},{key:"render",value:function(){return r.a.createElement("div",{className:"ContainerView"},r.a.createElement("div",{className:"ContainerViewBoard"},r.a.createElement(_,{board:this.state.board,onPlay:this.onBoardUpdate.bind(this)})),r.a.createElement("div",{className:"ContainerViewSidebar"},r.a.createElement("a",{href:"https://github.com/OR13/G0"},"Source Code"),r.a.createElement(j,{board:this.state.board}),r.a.createElement(g,{board:this.state.board})))}}]),e}(o.Component),E=new y(19),k=n(844),C=n(2020),A=new k({repo:"/orbitdb/yolo/browser/new/ipfs/0.27.3",start:!0,EXPERIMENTAL:{pubsub:!0},config:{Addresses:{Swarm:["/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star"]}}});A.on("error",function(t){return console.error(t)}),A.on("ready",Object(f.a)(h.a.mark(function t(){var e,n,o,r,a;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e=new C(A),n={replicate:!0,create:!0,sync:!0,localOnly:!1,write:["*"]},t.t0=console,t.next=5,A.id();case 5:t.t1=t.sent,t.t0.log.call(t.t0,t.t1);try{o=window.location.search.split("?address=")[1]}catch(i){}if(!o){t.next=15;break}return console.log("opened from address"),t.next=12,e.log(o);case 12:r=t.sent,t.next=20;break;case 15:return console.log("created log"),t.next=18,e.log("hello",n);case 18:r=t.sent,console.log(r.address.toString());case 20:return t.next=22,r.load(5);case 22:return window.ADD_DATA=function(){var t=Object(f.a)(h.a.mark(function t(e){var n;return h.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,r.add(e);case 2:n=t.sent,console.log(n);case 4:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),t.next=25,r.load();case 25:a=r.iterator({limit:-1}).collect(),console.log(a),r.events.on("replicated",function(){var t=r.iterator({limit:-1}).collect().map(function(t){return t.payload.value});console.log(t.join("\n"))});case 28:case"end":return t.stop()}},t,this)})));var P=function(t){function e(){return Object(s.a)(this,e),Object(u.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(c.a)(e,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(O,{board:E}))}}]),e}(o.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(P,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})},501:function(t,e){},553:function(t,e){},833:function(t,e,n){t.exports=n(2073)},838:function(t,e,n){},842:function(t,e,n){},929:function(t,e){},931:function(t,e){}},[[833,2,1]]]);
//# sourceMappingURL=main.cf1a06e2.chunk.js.map