(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{120:function(e,t,a){e.exports=a(150)},125:function(e,t,a){},150:function(e,t,a){"use strict";a.r(t);var n=a(0),o=a.n(n),l=a(13),r=a.n(l),s=a(36),c=(a(125),a(19)),i=a(20),u=a(16),m=a(21),d=a(22),f=a(14),h=a(192),g=a(80),p=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){return Object(c.a)(this,a),t.call(this,e)}return Object(i.a)(a,[{key:"render",value:function(){return o.a.createElement(h.a,{collapseOnSelect:!0,expand:"lg",bg:"primary",variant:"dark",fixed:"top"},o.a.createElement(h.a.Brand,{href:"/"},"Epiphany!"),o.a.createElement(h.a.Toggle,{"aria-controls":"responsive-navbar-nav"}),o.a.createElement(h.a.Collapse,{id:"responsive-navbar-nav"},o.a.createElement(g.a,{className:"mr-auto"},"true"!=localStorage.getItem("loggedIn")&&o.a.createElement(g.a.Link,{href:"/login"},"Login"),"true"!=localStorage.getItem("loggedIn")&&o.a.createElement(g.a.Link,{href:"/signup"},"Signup")),o.a.createElement(g.a,null,"true"===localStorage.getItem("loggedIn")&&o.a.createElement(g.a.Link,{href:"/profile"},"Profile"),"true"===localStorage.getItem("loggedIn")&&o.a.createElement(g.a.Link,{href:"/post"},"Post"),o.a.createElement(g.a.Link,{onClick:this.props.callback},"Logout"))))}}]),a}(n.Component),b=a(18),E=a.n(b),v=a(29),y=a(30),k=a.n(y),w=a(47),j=a(41),O=a(24),S=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={post:null},n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=Object(v.a)(E.a.mark((function e(){var t,a;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.props.match.params,e.next=3,k.a.get("http://localhost:5000/posts/".concat(t.postId));case 3:a=e.sent.data,this.setState({post:a.json_post});case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this.state.post;if(null===e)return o.a.createElement("p",null,"Loading ...");var t=e.body;return console.log(e.tags),o.a.createElement("div",{className:"container"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"jumbotron col-12"},o.a.createElement("h1",{className:"display-3"},e.title),o.a.createElement(j.a,null,e.tags&&e.tags.map((function(e){return o.a.createElement(O.a,{style:{paddingLeft:2,paddingRight:2},md:"auto"},o.a.createElement("h4",null,o.a.createElement(w.a,{variant:"info"},e.name)))}))),o.a.createElement("hr",{className:"my-4"}),o.a.createElement("p",null,"Content:"),o.a.createElement("p",{className:"lead"},t.split("\n").map((function(e,t){return o.a.createElement("div",{key:t},e)}))))))}}]),a}(n.Component),C=a(66),I=a(110),L=a(15),x=a(46),N=a(104),P=a(190),T=a(191),B=a(50),G=a(103),M=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).colors=["#ffbaba","#ffddab","#fdffcf","#bdffb3","#b8fff9","#ffd1ea","#edc4ff"],n.state={posts:null,filteredPosts:null,tags:null,tagsList:null,key:0},n.filterPosts=n.filterPosts.bind(Object(u.a)(n)),n.filterTags=n.filterTags.bind(Object(u.a)(n)),n.deleteTag=n.deleteTag.bind(Object(u.a)(n)),n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=Object(v.a)(E.a.mark((function e(){var t,a,n,o,l,r,s;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k.a.get("http://epiphany-test-three.herokuapp.com/main");case 2:for(l in t=e.sent.data,console.log(t.data[0]),a=t.data[0],n=t.data[1],console.log(a),o=[],a)o.push(a[l]);for(s in console.log(o),r=[],n)r.push(n[s]);this.setState({posts:o,filteredPosts:o,tagsList:r}),console.log(this.state.posts),console.log(this.state.filteredPosts),console.log(this.state.tagsList);case 16:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"filterPosts",value:function(e){this.setState({filteredPosts:this.state.posts.filter((function(t){return t.title.toLowerCase().includes(e.target.value.toLowerCase())||t.body.toLowerCase().includes(e.target.value.toLowerCase())}))})}},{key:"deleteTag",value:function(e){console.log(e.target.id);var t=[],a=(t=null===this.state.tags?[]:this.state.tags).indexOf(e.target.id);console.log(a),t.splice(a,1),this.setState({tags:t,filteredPosts:this.state.posts.filter((function(e){var a=0;return t.forEach((function(t){e.tags.forEach((function(e){e.name.toLowerCase().includes(t.toLowerCase())&&(a+=1)}))})),a===t.length}))}),console.log(t)}},{key:"filterTags",value:function(e){if(39===e.keyCode){var t=[];(t=null===this.state.tags?[]:this.state.tags).push(e.target.value),this.setState({tags:t,filteredPosts:this.state.posts.filter((function(e){var a=0;return t.forEach((function(t){e.tags.forEach((function(e){e.name.toLowerCase().includes(t.toLowerCase())&&(a+=1)}))})),a===t.length}))})}console.log(this.state.tags)}},{key:"getColor",value:function(){0===this.colors.length&&(this.colors=["#ffbaba","#ffddab","#fdffcf","#bdffb3","#b8fff9","#ffd1ea","#edc4ff"]);var e=this.colors.length,t=Math.floor(Math.random()*e),a=this.colors[t];return this.colors.splice(t,1),a}},{key:"render",value:function(){var e=this,t=this.state.tagsList,a=0;function n(){return a+=1}return o.a.createElement(G.a,{className:"justify-content-md-center"},o.a.createElement("div",{className:"row"},o.a.createElement(O.a,null,o.a.createElement(L.a,null,o.a.createElement(L.a.Group,{controlId:"formSearch"},o.a.createElement(L.a.Control,{label:"freeSolo",type:"text",placeholder:"Search posts!",onChange:this.filterPosts}),o.a.createElement(L.a.Text,{className:"text-muted"},"Here, you can search with text that matches the title or body of the posts."))))),o.a.createElement("div",{className:"row"},o.a.createElement(j.a,{style:{paddingLeft:25}},this.state.tags&&this.state.tags.map((function(t){return o.a.createElement(N.a,{style:{paddingLeft:2,paddingRight:2,paddingTop:2,paddingBottom:5},"aria-label":"Basic example"},o.a.createElement(x.a,{onClick:e.deleteTag,id:t,variant:"secondary"},"x"),o.a.createElement(x.a,{variant:"secondary"},t))})))),o.a.createElement("div",{className:"row"},this.state.tagsList&&o.a.createElement("div",{style:{width:1125,paddingLeft:15}},o.a.createElement(T.a,{id:"free-solo-demo",freeSolo:!0,options:t.map((function(e){return e.name})),renderInput:function(t){return o.a.createElement(P.a,Object.assign({},t,{id:"standard-full-width",label:"Search with tags!",margin:"normal",variant:"outlined",onKeyUp:e.filterTags}))}}))),null===this.state.posts&&o.a.createElement("div",null," ",o.a.createElement(I.a,{animation:"border",variant:"primary"})," ",o.a.createElement("p",null,"Loading posts...")),this.state.filteredPosts&&this.state.filteredPosts.map((function(t){return o.a.createElement(j.a,{className:"justify-content-md-center"},o.a.createElement(s.b,{key:n(),to:"/post/".concat(t.id)},o.a.createElement(B.a,{key:t.id,style:{backgroundColor:e.getColor(),marginTop:10,marginBottom:10,alignItems:"center",width:"50rem"}},o.a.createElement(B.a.Body,null,o.a.createElement(B.a.Title,{style:{color:"#161717",textAlign:"center"}},t.title),o.a.createElement(j.a,{className:"justify-content-md-center"},t.tags&&t.tags.map((function(e){return o.a.createElement(O.a,{key:n(),style:{paddingLeft:2,paddingRight:2,alignItems:"center"},md:"auto"},o.a.createElement(w.a,{variant:"info"},e.name))}))),o.a.createElement(B.a.Text,{style:{color:"#161717",textAlign:"center"}},o.a.createElement(C.a,{lines:2},t.body))),o.a.createElement(B.a.Footer,{className:"text-muted",style:{color:"#161717",textAlign:"center"}},"Posted by ",t.user," at ",t.time))))})))}}]),a}(n.Component),D=a(70),K=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={email:"",password:"",loggedIn:!1},n.handleChange=n.handleChange.bind(Object(u.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(u.a)(n)),n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=localStorage.getItem("loggedIn");console.log(e)}},{key:"handleChange",value:function(e){this.setState(Object(D.a)({},e.target.name,e.target.value))}},{key:"handleSubmit",value:function(){var e=Object(v.a)(E.a.mark((function e(t){var a,n=this;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a={email:this.state.email,password:this.state.password},k.a.post("http://localhost:5000/login",a).then((function(e){localStorage.setItem("userName",e.data.user_info[0].name),localStorage.setItem("userEmail",n.state.email),localStorage.setItem("userPoints",e.data.user_info[0].points),localStorage.setItem("loggedIn",!0),n.setState({loggedIn:!0}),n.props.callback()}),(function(e){console.log("Looks like there was a problem: \n",e)})),t.preventDefault();case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return this.state.loggedIn?o.a.createElement(f.a,{to:"/"}):o.a.createElement(O.a,{md:{span:"4",offset:"4"}},o.a.createElement(L.a,{onSubmit:this.handleSubmit},o.a.createElement(L.a.Group,{controlId:"formGroupEmail"},o.a.createElement(L.a.Label,null,"Email address"),o.a.createElement(L.a.Control,{type:"email",name:"email",placeholder:"Enter email",email:this.state.email,onChange:this.handleChange})),o.a.createElement(L.a.Group,{controlId:"formGroupPassword"},o.a.createElement(L.a.Label,null,"Password"),o.a.createElement(L.a.Control,{type:"password",name:"password",placeholder:"Password",password:this.state.password,onChange:this.handleChange})),o.a.createElement(x.a,{variant:"success",type:"submit"},"Submit")))}}]),a}(n.Component),R=a(111),A=a(54),F=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).colors=["#ffbaba","#ffddab","#fdffcf","#bdffb3","#b8fff9","#ffd1ea","#edc4ff"],n.state={posts:null},n}return Object(i.a)(a,[{key:"componentDidMount",value:function(){var e=Object(v.a)(E.a.mark((function e(){var t,a=this;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t={email:localStorage.getItem("userEmail")},console.log(t),k.a.post("http://localhost:5000/profile",t).then((function(e){console.log(e.data.posts);var t=e.data.posts,n=[];for(var o in t)n.push(t[o]);a.setState({posts:n})}),(function(e){console.log("Looks like there was a problem: \n",e)}));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"getColor",value:function(){0===this.colors.length&&(this.colors=["#ffbaba","#ffddab","#fdffcf","#bdffb3","#b8fff9","#ffd1ea","#edc4ff"]);var e=this.colors.length,t=Math.floor(Math.random()*e),a=this.colors[t];return this.colors.splice(t,1),a}},{key:"render",value:function(){var e=this;return o.a.createElement("div",{className:"container"},o.a.createElement(R.a,{defaultActiveKey:"profile",id:"uncontrolled-tab-example"},o.a.createElement(A.a,{eventKey:"profile",title:"Profile"},o.a.createElement("div",{className:"row"},o.a.createElement("div",{className:"jumbotron col-12"},o.a.createElement("h1",{className:"display-3"},localStorage.getItem("userName")),o.a.createElement("h2",{className:"display-3"},"Points: ",localStorage.getItem("userPoints"))))),o.a.createElement(A.a,{eventKey:"posts",title:"Posts"},o.a.createElement("div",{className:"row"},this.state.posts&&this.state.posts.map((function(t){return o.a.createElement("div",{key:t.id,className:"col-sm-12 col-md-4 col-lg-3"},o.a.createElement(s.b,{to:"/post/".concat(t.id)},o.a.createElement("div",{className:"card mb-3",style:{backgroundColor:e.getColor(),color:"#161717",height:"250px"}},o.a.createElement("div",{className:"card-body"},o.a.createElement("h4",{className:"card-title"},t.title),o.a.createElement(j.a,null,t.tags&&t.tags.map((function(e){return o.a.createElement(O.a,{style:{paddingLeft:2,paddingRight:2},md:"auto"},o.a.createElement(w.a,{variant:"info"},e.name))}))),o.a.createElement("p",{className:"card-text",style:{maxLength:"100"}},o.a.createElement(C.a,{lines:2},t.body))))))})))),o.a.createElement(A.a,{eventKey:"followers",title:"Followers"},"hello again"),o.a.createElement(A.a,{eventKey:"following",title:"Following"},"hello again2")))}}]),a}(n.Component),_=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).state={title:"",body:"",posted:!1},n.handleChange=n.handleChange.bind(Object(u.a)(n)),n.handleSubmit=n.handleSubmit.bind(Object(u.a)(n)),n}return Object(i.a)(a,[{key:"handleChange",value:function(e){this.setState(Object(D.a)({},e.target.name,e.target.value))}},{key:"handleSubmit",value:function(){var e=Object(v.a)(E.a.mark((function e(t){var a,n=this;return E.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a={title:this.state.title,body:this.state.body,user:localStorage.getItem("userEmail")},k.a.post("http://localhost:5000/create",a).then((function(e){console.log(e),n.setState({posted:!0})}),(function(e){console.log("Looks like there was a problem: \n",e)})),t.preventDefault();case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"render",value:function(){return this.state.posted?o.a.createElement(f.a,{to:"/"}):o.a.createElement(O.a,{style:{paddingLeft:200,paddingRight:200}},o.a.createElement(L.a,{onSubmit:this.handleSubmit},o.a.createElement(L.a.Group,{controlId:"formGroupTitle"},o.a.createElement(L.a.Label,null,"Title"),o.a.createElement(L.a.Control,{type:"text",name:"title",placeholder:"Enter title",title:this.state.title,onChange:this.handleChange})),o.a.createElement(L.a.Group,{controlId:"formGroupPassword"},o.a.createElement(L.a.Label,null,"Body"),o.a.createElement(L.a.Control,{as:"textarea",rows:"15",name:"body",placeholder:"Body",password:this.state.body,onChange:this.handleChange})),o.a.createElement(x.a,{variant:"success",type:"submit"},"Submit")))}}]),a}(n.Component),J=function(e){Object(d.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(c.a)(this,a),(n=t.call(this,e)).logout=n.logout.bind(Object(u.a)(n)),n.login=n.login.bind(Object(u.a)(n)),n.state={login:!1},n}return Object(i.a)(a,[{key:"login",value:function(){this.setState({login:!0})}},{key:"logout",value:function(){localStorage.clear(),this.setState({login:!1})}},{key:"render",value:function(){var e=this,t=localStorage.getItem("loggedIn");return console.log(t),o.a.createElement("div",null,o.a.createElement(p,{callback:this.logout}),o.a.createElement(f.b,{exact:!0,path:"/",component:M}),o.a.createElement(f.b,{exact:!0,path:"/post/:postId",component:S}),"true"!=localStorage.getItem("loggedIn")&&o.a.createElement(f.b,{exact:!0,path:"/login",component:function(){return o.a.createElement(K,{callback:e.login})}}),o.a.createElement(f.b,{exact:!0,path:"/profile",component:F}),o.a.createElement(f.b,{exact:!0,path:"/post",component:_}))}}]),a}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(s.a,null,o.a.createElement(J,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[120,1,2]]]);
//# sourceMappingURL=main.8de28e50.chunk.js.map