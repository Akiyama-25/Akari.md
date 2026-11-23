import"./disclose-version.DwdwGuwu.js";import{B as y,D as p,F as D,H as Te,J as G,K as oe,L as Me,M as L,N as Ee,O as ee,P as n,Q as a,R as o,S as Le,T as j,U as re,V as De,W as ce,X as ze,Y as $,Z as Ie,_ as Ve,b as fe,c as R,d as q,et as Re,f as He,g as Be,j as Y,k as T,m as ye,p as qe,q as ae,r as Fe,t as Q,u as be,v as H,y as he,z as Z}from"./client.JNghZhR3.js";import{t as I}from"./Icon.C19tT9us.js";import{n as W,t as J}from"./translation.DrG0rowD.js";import{n as le}from"./config.DAGuDat8.js";import{n as Ae,t as f}from"./musicPlayerStore.CwNaQy5D.js";import{a as se,c as Ke,i as Ne,l as Xe,n as je,o as Ue,r as Ye,s as Oe,t as We}from"./SidebarTrackInfo.CRPln2ZO.js";ze();function Je(c){const e=c-1;return e*e*e+1}function xe(c){const e=c-1;return e*e*e+1}function de(c){const e=typeof c=="string"&&c.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[c,"px"]}function Qe(c,{delay:e=0,duration:t=400,easing:l=xe,x:s=0,y:r=0,opacity:b=0}={}){const d=getComputedStyle(c),k=+d.opacity,i=d.transform==="none"?"":d.transform,u=k*(1-b),[g,m]=de(s),[P,_]=de(r);return{delay:e,duration:t,easing:l,css:(v,x)=>`
			transform: ${i} translate(${(1-v)*g}${m}, ${(1-v)*P}${_});
			opacity: ${k-u*x}`}}function Ze(c,{delay:e=0,duration:t=400,easing:l=xe,axis:s="y"}={}){const r=getComputedStyle(c),b=+r.opacity,d=s==="y"?"height":"width",k=parseFloat(r[d]),i=s==="y"?["top","bottom"]:["left","right"],u=i.map(w=>`${w[0].toUpperCase()}${w.slice(1)}`),g=parseFloat(r[`padding${u[0]}`]),m=parseFloat(r[`padding${u[1]}`]),P=parseFloat(r[`margin${u[0]}`]),_=parseFloat(r[`margin${u[1]}`]),v=parseFloat(r[`border${u[0]}Width`]),x=parseFloat(r[`border${u[1]}Width`]);return{delay:e,duration:t,easing:l,css:w=>`overflow: hidden;opacity: ${Math.min(w*20,1)*b};${d}: ${w*k}px;padding-${i[0]}: ${w*g}px;padding-${i[1]}: ${w*m}px;margin-${i[0]}: ${w*P}px;margin-${i[1]}: ${w*_}px;border-${i[0]}-width: ${w*v}px;border-${i[1]}-width: ${w*x}px;min-${d}: 0`}}var Ge=T('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function $e(c,e){$(e,!0);let t=ce(De(f.getState())),l=ce(!1),s;function r(S){const B=S;B.detail&&re(t,B.detail,!0)}fe(()=>{s=f.subscribe(S=>{re(t,S,!0)}),window.addEventListener("music-sidebar:state",r),f.initialize()}),he(()=>{s&&(s(),s=void 0),typeof window<"u"&&window.removeEventListener("music-sidebar:state",r)});function b(){f.toggle()}function d(){f.prev()}function k(){f.next()}function i(){f.toggleMode()}function u(){re(l,!n(l))}function g(S){f.playIndex(S)}function m(S){f.seek(S)}function P(){f.toggleMute()}function _(S){f.setVolume(S)}var v=Ge(),x=o(v),w=o(x);Ne(w,{get currentSong(){return n(t).currentSong},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading}}),We(y(w,2),{get currentSong(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},onToggleMute:P,onSetVolume:_}),a(x);var z=y(x,2);je(z,{get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},onSeek:m});var C=y(z,2);Ue(C,{get isPlaying(){return n(t).isPlaying},get isShuffled(){return n(t).isShuffled},get repeatMode(){return n(t).isRepeating},onToggleMode:i,onPrev:d,onNext:k,onTogglePlay:b,onTogglePlaylist:u}),Ye(y(C,2),{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(l)},onClose:u,onPlaySong:g}),a(v),p(c,v),G()}var et=T('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),tt=T('<div class="text-xs text-30 mt-1"> </div>'),nt=T('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function ge(c,e){$(e,!0);const t=Q(e,"showTime",3,!1),l=Q(e,"size",3,"mini");function s(i){return!Number.isFinite(i)||i<0?"0:00":`${Math.floor(i/60)}:${Math.floor(i%60).toString().padStart(2,"0")}`}var r=ee(),b=Z(r),d=i=>{var u=et(),g=o(u),m=o(g,!0);a(g);var P=y(g,2),_=o(P,!0);a(P),a(u),D(()=>{j(m,e.song.title),j(_,e.song.artist)}),p(i,u)},k=i=>{var u=nt(),g=o(u),m=o(g,!0);a(g);var P=y(g,2),_=o(P,!0);a(P);var v=y(P,2),x=w=>{var z=tt(),C=o(z);a(z),D((S,B)=>j(C,`${S??""} / ${B??""}`),[()=>s(e.currentTime),()=>s(e.duration)]),p(w,z)};H(v,w=>{t()&&w(x)}),a(u),D(()=>{j(m,e.song.title),j(_,e.song.artist)}),p(i,u)};H(b,i=>{l()==="mini"?i(d):i(k,-1)}),p(c,r),G()}var it=T('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),rt=T('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),at=T("<!> <!> <!>",1),ot=T("<div><!></div>");function we(c,e){$(e,!0);const t=Q(e,"size",3,"mini"),l=Q(e,"showControls",3,!1),s=Q(e,"showPlaylist",3,!1);var r=ot(),b=o(r),d=i=>{var u=it(),g=Z(u);se(g,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",interactive:!0,get onclick(){return e.onCoverClick}});var m=y(g,2);ge(o(m),{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},size:"mini"}),a(m);var P=y(m,2),_=o(P);I(o(_),{icon:"material-symbols:visibility-off",class:"text-lg"}),a(_);var v=y(_,2);I(o(v),{icon:"material-symbols:expand-less",class:"text-lg"}),a(v),a(P),D((x,w)=>{R(m,"aria-label",x),R(_,"title",w)},[()=>J(W.musicPlayerExpand),()=>J(W.musicPlayerHide)]),L("click",m,function(...x){e.onInfoClick?.apply(this,x)}),L("keydown",m,x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),e.onInfoClick?.())}),L("click",_,x=>{x.stopPropagation(),e.onHideClick?.()}),L("click",v,x=>{x.stopPropagation(),e.onExpandClick?.()}),p(i,u)},k=i=>{var u=at(),g=Z(u);se(g,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded"});var m=y(g,2);ge(m,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},showTime:!0,size:"expanded"});var P=y(m,2),_=v=>{var x=rt(),w=o(x);I(o(w),{icon:"material-symbols:visibility-off",class:"text-lg"}),a(w);var z=y(w,2);let C;I(o(z),{icon:"material-symbols:queue-music",class:"text-lg"}),a(z),a(x),D((S,B)=>{R(w,"title",S),C=q(z,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,C,{"text-[var(--primary)]":s()}),R(z,"title",B)},[()=>J(W.musicPlayerHide),()=>J(W.musicPlayerPlaylist)]),L("click",w,function(...S){e.onHideClick?.apply(this,S)}),L("click",z,function(...S){e.onPlaylistClick?.apply(this,S)}),p(v,x)};H(P,v=>{l()&&v(_)}),p(i,u)};H(b,i=>{t()==="mini"?i(d):i(k,-1)}),a(r),D(()=>q(r,1,He(t()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),p(c,r),G()}Y(["click","keydown"]);var lt=T("<div><!></div>");function st(c,e){var t=lt();let l;we(o(t),{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",get onCoverClick(){return e.onCoverClick},get onInfoClick(){return e.onInfoClick},get onHideClick(){return e.onHideClick},get onExpandClick(){return e.onExpandClick}}),a(t),D(()=>l=q(t,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-70 svelte-g9ac72",null,l,{"mini-enter":!e.isHidden,"mini-leave":e.isHidden,"pointer-events-none":e.isHidden})),p(c,t)}var me=T("<button><!></button>");function ve(c,e){const t=Q(e,"repeatMode",3,0),l=Q(e,"disabled",3,!1);var s=ee(),r=Z(s),b=k=>{var i=me();let u;I(o(i),{icon:"material-symbols:shuffle",class:"text-lg"}),a(i),D(()=>{u=q(i,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),i.disabled=l()}),L("click",i,function(...g){e.onclick?.apply(this,g)}),p(k,i)},d=k=>{var i=me();let u;var g=o(i),m=v=>{I(v,{icon:"material-symbols:repeat-one",class:"text-lg"})},P=v=>{I(v,{icon:"material-symbols:repeat",class:"text-lg"})},_=v=>{I(v,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};H(g,v=>{t()===1?v(m):t()===2?v(P,1):v(_,-1)}),a(i),D(()=>u=q(i,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":e.isActive,"btn-plain":!e.isActive})),L("click",i,function(...v){e.onclick?.apply(this,v)}),p(k,i)};H(r,k=>{e.mode==="shuffle"?k(b):k(d,-1)}),p(c,s)}Y(["click"]);var ut=T('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function ct(c,e){var t=ut(),l=o(t);ve(l,{mode:"shuffle",get isActive(){return e.isShuffled},get onclick(){return e.onShuffleClick}});var s=y(l,2);Oe(s,{get onclick(){return e.onPrevClick},disabled:!1});var r=y(s,2);Ke(r,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get onclick(){return e.onPlayClick}});var b=y(r,2);Xe(b,{get onclick(){return e.onNextClick},disabled:!1});var d=y(b,2);{let k=ae(()=>e.isRepeating>0);ve(d,{mode:"repeat",get isActive(){return n(k)},get repeatMode(){return e.isRepeating},get onclick(){return e.onRepeatClick}})}a(t),p(c,t)}var dt=T('<div class="progress-bar flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-(--primary) rounded-full transition-all duration-100"></div></div>');function gt(c,e){$(e,!0);var t=dt(),l=o(t);a(t),D(s=>{R(t,"aria-label",s),R(t,"aria-valuenow",e.duration>0?e.currentTime/e.duration*100:0),be(l,`width: ${e.duration>0?e.currentTime/e.duration*100:0}%`)},[()=>J(W.musicPlayerProgress)]),L("click",t,function(...s){e.onclick?.apply(this,s)}),L("keydown",t,function(...s){e.onkeydown?.apply(this,s)}),p(c,t),G()}Y(["click","keydown"]);var mt=T('<div class="progress-section mb-4"><!></div>');function vt(c,e){var t=mt();gt(o(t),{get currentTime(){return e.currentTime},get duration(){return e.duration},get onclick(){return e.onProgressClick},get onkeydown(){return e.onProgressKeyDown}}),a(t),p(c,t)}var ft=T('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function yt(c,e){var t=ft(),l=o(t),s=d=>{I(d,{icon:"material-symbols:volume-off",class:"text-lg"})},r=d=>{I(d,{icon:"material-symbols:volume-down",class:"text-lg"})},b=d=>{I(d,{icon:"material-symbols:volume-up",class:"text-lg"})};H(l,d=>{e.isMuted||e.volume===0?d(s):e.volume<.5?d(r,1):d(b,-1)}),a(t),L("click",t,function(...d){e.onclick?.apply(this,d)}),p(c,t)}Y(["click"]);var bt=T('<div class="flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function ht(c,e){var t=bt(),l=o(t);let s;a(t),qe(t,r=>e.volumeBarRef?.(r)),D(()=>{R(t,"aria-label",e.ariaLabel),R(t,"aria-valuenow",e.volume*100),s=q(l,1,"h-full bg-(--primary) rounded-full transition-all",null,s,{"duration-100":!e.isVolumeDragging,"duration-0":e.isVolumeDragging}),be(l,`width: ${e.volume*100}%`)}),L("pointerdown",t,function(...r){e.onpointerdown?.apply(this,r)}),L("keydown",t,function(...r){e.onkeydown?.apply(this,r)}),p(c,t)}Y(["pointerdown","keydown"]);var xt=T('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function wt(c,e){var t=xt(),l=o(t);yt(l,{get volume(){return e.volume},get isMuted(){return e.isMuted},get onclick(){return e.onVolumeButtonClick}});var s=y(l,2);{let b=ae(()=>e.isMuted?0:e.volume);ht(s,{get volume(){return n(b)},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onpointerdown(){return e.onSliderPointerDown},get onkeydown(){return e.onSliderKeyDown},get ariaLabel(){return e.ariaLabel}})}var r=y(s,2);Le(r,()=>e.children??Re),a(t),p(c,t)}var pt=T('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),kt=T("<div><!> <!> <!> <!></div>");function _t(c,e){$(e,!0);var t=kt();let l;var s=o(t);we(s,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return e.showPlaylist},get onHideClick(){return e.onHideClick},get onPlaylistClick(){return e.onPlaylistClick}});var r=y(s,2);vt(r,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onProgressClick(){return e.onProgressClick},get onProgressKeyDown(){return e.onProgressKeyDown}});var b=y(r,2);ct(b,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get isShuffled(){return e.isShuffled},get isRepeating(){return e.isRepeating},get canSkip(){return e.canSkip},get onPlayClick(){return e.onPlayClick},get onPrevClick(){return e.onPrevClick},get onNextClick(){return e.onNextClick},get onShuffleClick(){return e.onShuffleClick},get onRepeatClick(){return e.onRepeatClick}});var d=y(b,2);{let k=ae(()=>J(W.musicPlayerVolume));wt(d,{get volume(){return e.volume},get isMuted(){return e.isMuted},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onVolumeButtonClick(){return e.onVolumeButtonClick},get onSliderPointerDown(){return e.onSliderPointerDown},get onSliderKeyDown(){return e.onSliderKeyDown},get ariaLabel(){return n(k)},children:(i,u)=>{var g=pt();I(o(g),{icon:"material-symbols:expand-more",class:"text-lg"}),a(g),D(m=>R(g,"title",m),[()=>J(W.musicPlayerCollapse)]),L("click",g,function(...m){e.onCollapseClick?.apply(this,m)}),p(i,g)},$$slots:{default:!0}})}a(t),D(()=>l=q(t,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,l,{"opacity-0":e.isHidden,"scale-95":e.isHidden,"pointer-events-none":e.isHidden})),p(c,t),G()}Y(["click"]);var Pt=T('<span class="text-sm text-[var(--content-meta)]"> </span>'),Ct=T('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function St(c,e){$(e,!0);const t=Q(e,"lazy",3,!0);var l=Ct();let s;var r=o(l),b=o(r),d=C=>{I(C,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},k=C=>{I(C,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},i=C=>{var S=Pt(),B=o(S,!0);a(S),D(()=>j(B,e.index+1)),p(C,S)};H(b,C=>{e.isCurrent&&e.isPlaying?C(d):e.isCurrent?C(k,1):C(i,-1)}),a(r);var u=y(r,2),g=o(u);a(u);var m=y(u,2),P=o(m);let _;var v=o(P,!0);a(P);var x=y(P,2);let w;var z=o(x,!0);a(x),a(m),a(l),D(C=>{s=q(l,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,s,{"bg-[var(--btn-plain-bg)]":e.isCurrent,"text-[var(--primary)]":e.isCurrent}),R(l,"aria-label",`播放 ${e.song.title??""} - ${e.song.artist??""}`),R(g,"src",C),R(g,"alt",e.song.title),R(g,"loading",t()?"lazy":"eager"),_=q(P,1,"font-medium truncate",null,_,{"text-[var(--primary)]":e.isCurrent,"text-90":!e.isCurrent}),j(v,e.song.title),w=q(x,1,"text-sm text-[var(--content-meta)] truncate",null,w,{"text-[var(--primary)]":e.isCurrent}),j(z,e.song.artist)},[()=>Ae(e.song.cover||"/favicon/favicon.ico")]),L("click",l,function(...C){e.onclick?.apply(this,C)}),L("keydown",l,C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),e.onclick())}),p(c,l),G()}Y(["click","keydown"]);var Tt=T('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-(--line-divider)"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Mt(c,e){$(e,!0);var t=ee(),l=Z(t),s=r=>{var b=Tt(),d=o(b),k=o(d),i=o(k,!0);a(k);var u=y(k,2);I(o(u),{icon:"material-symbols:close",class:"text-lg"}),a(u),a(d);var g=y(d,2);Be(g,21,()=>e.playlist,Ve,(m,P,_)=>{{let v=ae(()=>_===e.currentIndex);St(m,{get song(){return n(P)},index:_,get isCurrent(){return n(v)},get isPlaying(){return e.isPlaying},onclick:()=>e.onPlaySong(_),lazy:_!==0})}}),a(g),a(b),D(m=>j(i,m),[()=>J(W.musicPlayerPlaylist)]),L("click",u,function(...m){e.onClose?.apply(this,m)}),ye(3,b,()=>Ze,()=>({duration:300,axis:"y"})),p(r,b)};H(l,r=>{e.show&&r(s)}),p(c,t),G()}Y(["click"]);var Et=T('<div class="fixed bottom-20 right-4 z-60 max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Lt=T('<div class="music-player-fab-anchor fixed z-55"><div class="music-player-fab-shell"><!></div></div>'),Dt=T("<div><div><!></div> <!> <!> <!></div>"),zt=T(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (width < 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (width < 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function Nt(c,e){$(e,!1);let t=Te(f.getState());const l=le.showFloatingPlayer,s=(le.floatingEntryMode??"default")==="fab",r=l&&le.enable;let b;function d(){f.toggle()}function k(){f.prev()}function i(){f.next()}function u(){f.toggleShuffle()}function g(){f.toggleRepeat()}function m(h){f.playIndex(h)}function P(h){const M=h.currentTarget;if(!M)return;const U=M.getBoundingClientRect(),N=(h.clientX-U.left)/U.width;f.setProgress(N)}function _(h){(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),f.setProgress(.5))}function v(){f.toggleMute()}function x(){f.toggleMute()}function w(h){const M=h.currentTarget;if(!M)return;const U=E=>{const F=M.getBoundingClientRect();if(F.width<=0)return;const A=Math.max(0,Math.min(1,(E-F.left)/F.width));f.setVolume(A)};U(h.clientX);const N=h.pointerId;M.setPointerCapture(N);const te=E=>{E.pointerId===N&&U(E.clientX)},ne=()=>{M.removeEventListener("pointermove",te),M.removeEventListener("pointerup",ie),M.removeEventListener("pointercancel",V),M.hasPointerCapture(N)&&M.releasePointerCapture(N)},ie=E=>{E.pointerId===N&&(U(E.clientX),ne())},V=E=>{E.pointerId===N&&ne()};M.addEventListener("pointermove",te),M.addEventListener("pointerup",ie),M.addEventListener("pointercancel",V)}function z(h){const M=h.target;if(!(M?.tagName==="INPUT"||M?.tagName==="TEXTAREA"||M?.contentEditable==="true")){if(h.key==="ArrowLeft"||h.key==="ArrowDown"){h.preventDefault(),f.setVolume(n(t).volume-.05);return}if(h.key==="ArrowRight"||h.key==="ArrowUp"){h.preventDefault(),f.setVolume(n(t).volume+.05);return}(h.key==="Enter"||h.key===" "||h.key==="m"||h.key==="M")&&(h.preventDefault(),v())}}function C(){f.togglePlaylist()}function S(){f.toggleExpanded()}function B(){f.toggleHidden()}function pe(){f.hideError()}function ke(h){}function _e(){return f.canSkip()}fe(()=>{b=f.subscribe(h=>{re(t,h)}),f.initialize()}),he(()=>{b&&b(),f.destroy()}),Fe();var ue=ee();Ee("keydown",Me,z);var Pe=Z(ue),Ce=h=>{var M=zt(),U=Z(M),N=V=>{var E=Et(),F=o(E),A=o(F);I(A,{icon:"material-symbols:error",class:"text-xl shrink-0"});var X=y(A,2),O=o(X,!0);a(X);var K=y(X,2);I(o(K),{icon:"material-symbols:close",class:"text-lg"}),a(K),a(F),a(E),D(()=>j(O,n(t).errorMessage)),L("click",K,pe),p(V,E)};H(U,V=>{n(t).showError&&V(N)});var te=y(U,2),ne=V=>{var E=ee(),F=Z(E),A=X=>{var O=Lt(),K=o(O);$e(o(K),{}),a(K),a(O),ye(3,K,()=>Qe,()=>({y:16,duration:280,opacity:.12,easing:Je})),p(X,O)};H(F,X=>{n(t).isExpanded&&X(A)}),p(V,E)},ie=V=>{var E=Dt();let F;var A=o(E);se(o(A),{get cover(){return n(t).currentSong.cover},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},size:"orb",onclick:B}),a(A);var X=y(A,2);{let K=oe(()=>n(t).isExpanded||n(t).isHidden);st(X,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isHidden(){return n(K)},onCoverClick:d,onInfoClick:S,onHideClick:B,onExpandClick:S})}var O=y(X,2);{let K=oe(_e),Se=oe(()=>!n(t).isExpanded);_t(O,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isShuffled(){return n(t).isShuffled},get isRepeating(){return n(t).isRepeating},get showPlaylist(){return n(t).showPlaylist},get canSkip(){return n(K)},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},isVolumeDragging:!1,get isHidden(){return n(Se)},volumeBarRef:ke,onPlayClick:d,onPrevClick:k,onNextClick:()=>i(),onShuffleClick:u,onRepeatClick:g,onProgressClick:P,onProgressKeyDown:_,onVolumeButtonClick:x,onSliderPointerDown:w,onSliderKeyDown:z,onHideClick:B,onPlaylistClick:C,onCollapseClick:S})}Mt(y(O,2),{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(t).showPlaylist},onClose:C,onPlaySong:m}),a(E),D(()=>{F=q(E,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,F,{expanded:n(t).isExpanded,"hidden-mode":n(t).isHidden}),q(A,1,`orb-player-container ${n(t).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),p(V,E)};H(te,V=>{s?V(ne):V(ie,-1)}),Ie(2),p(h,M)};H(Pe,h=>{r&&h(Ce)}),p(c,ue),G()}Y(["click"]);export{Nt as default};
