import React, { PureComponent } from 'react';
import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'babel-polyfill';
import InstagramEmbed from 'react-instagram-embed';
import { getUserInfo, getImages, getImagesTemp } from 'utils/helpers';
import { Entity, Scene } from 'aframe-react';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
			color: 'red',
			renderBox: false,
      images: [],
			currentUser: '4ch_one',
			userHistory: [{currentUser: '4ch_one', lastId: 0}],
			lastId: 0
		};
  }

	pushHistory() {
		console.log('this.history',[this.state.userHistory]);
		this.setState({
			userHistory: this.state.userHistory.concat({
				lastId: this.state.lastId, currentUser: this.state.currentUser
			})
		});
	}

	componentDidMount() {
		// this.pushHistory();
    getImagesTemp(this.state.currentUser, 0)
      .then((data) => {
        this.setState({
          images: data.images, // TODO add images instagramm
					usernames: data.usernames,
					lastId: data.lastId
        });
      })
		this.setState({renderBox: true});
	}

  renderPost = () => (
    // https://github.com/sugarshin/react-instagram-embed
    <InstagramEmbed
      url='https://instagr.am/p/Zw9o4/'
      maxWidth={320}
      hideCaption={false}
      containerTagName='div'
      protocol=''
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
    />
  );

	enterHandle = () => {
		console.log('hello',[document.getElementById('anim123').components.animation.animation]);
		document.getElementById('anim123').components.animation.animation.pause();
	}

	leaveHandle = () => {
		document.getElementById('anim123').components.animation.animation.play();
	}

	clickHandle = (e) => {
		this.setState({
			currentUser: e.target.getAttribute('datausername'),
			lastId: -1
	});
		console.log(this.state);
		this.animationCompleteHandle();
	}

	loadLast = () => {
    getImagesTemp(this.state.currentUser, this.state.lastId)
      .then((data) => {
        this.setState({
          images: data.images, // TODO add images instagramm
					usernames: data.usernames,
					lastId: data.lastId
        });
				console.log('loaded images',this.state);
      })
		this.setState({renderBox: true});
		this.leaveHandle(); //start animation
	}

	backClickHandle = () => {
		if (this.state.userHistory.length >= 2) {
			let lastHist = this.state.userHistory[this.state.userHistory.length - 2];
			console.log('lastHist', lastHist);
			this.setState({
				userHistory: this.state.userHistory.slice(0, this.state.userHistory.length - 2),
				currentUser: lastHist.currentUser,
				lastId: lastHist.lastId
			});
			this.animationCompleteHandle();
		}
	}

	animationCompleteHandle = (e) => {
		console.log('animationCompleteHandle');
		console.log(this);
		console.log(e);
		this.pushHistory();
    getImagesTemp(this.state.currentUser, this.state.lastId)
      .then((data) => {
        this.setState({
          images: data.images, // TODO add images instagramm
					usernames: data.usernames,
					lastId: data.lastId
        });
				console.log('loaded images',this.state);
      })
		this.setState({renderBox: true});
		this.leaveHandle(); //start animation
	}

	createBoxes = () => {
		let images = this.state.images;
		let coords = [];
		let blockId = 0;
		for (let i = 0; i < images.length; i++) {
			coords.push({x: -1.5 * 3, y: 2, z: -i*3, id: blockId, src:images[i], username:this.state.usernames[i]});
			blockId += 1;
		}
		for (let i = 0; i < images.length; i++) {
			coords.push({x: 1.5 * 3, y: 2, z: -i*3, id: blockId, src:images[i], username:this.state.usernames[i]});
			blockId += 1;
		}
		let params = {}
		params.shift = ((((images.length * 3).toString())));
		params.duration = (images.length * 1000).toString();
		console.log(params);
					// animation={`property: position; dur: ${params.duration}; to: 0 0 ${params.shift}`}
		return (<Entity primitive='a-box' position="0 0 0" id="anim123"
					animation={"property: position; dur: " + params.duration + "; to: 0 0 " + params.shift}
					events={{
						animationbegin: () => {console.log('animationbegin')},
						animationcomplete: this.animationCompleteHandle
					}}
		>
		{coords.map((pos) => (
			<Entity
				visible="true"
				primitive="a-box"
				height="4"
				widht="3"
				depth="3"
				key={pos.id}
				position={`${pos.x} ${pos.y} ${pos.z}`}
				src={`${pos.src}`}
				dataUsername={`${pos.username}`}
				events={{
					mouseenter:this.enterHandle,
					mouseleave:this.leaveHandle,
					click: this.clickHandle,
					touchend: this.clickHandle
				}}
				/>
			)
		)}
		</Entity>);
	}

  changeColor = () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
    this.setState({
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  };

  render () {
    return (
      <Scene>
        <a-assets>
          <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg"/>
          <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg"/>
        </a-assets>

        <Entity primitive="a-plane" src="#groundTexture" rotation="-90 0 0" height="100" width="100"/>
        <Entity primitive="a-light" type="ambient" color="#445451"/>
        <Entity primitive="a-light" type="point" intensity="2" position="2 4 4"/>
        <Entity primitive="a-sky" height="2048" radius="30" src="#skyTexture" theta-length="90" width="2048"/>
				<Entity
					primitive="a-box"
					position="0 0 0"
					src="https://image.flaticon.com/icons/png/512/13/13964.png"
					animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}
					events={{
						click: this.backClickHandle,
						touchend: this.backClickHandle
					}}
				/>

        <Entity primitive="a-camera">
          <Entity primitive="a-cursor" animation__click={{property: 'scale', startEvents: 'click', from: '0.1 0.1 0.1', to: '1 1 1', dur: 150}}/>
        </Entity>
				{this.state.renderBox && this.createBoxes()}
      </Scene>
    );
  }
}

export default App;
