import React from 'react'
import {Link} from 'react-router'
import NavBar from './NavBar'
import * as auth from '../models/auth'
import * as art from '../models/art'
import GoogleMap from 'google-map-react';
import TheMap from './theMap'



export default class ArtistMap extends React.Component {

constructor() {
		super()
		this.state = {
			artists: [],
			artistLat:[],
			ArtName:[],
			ArtLocation:[],
			ArtTitle:[],
			ArtistName:[],
			ArtImage:[],
			ArtWeb:[]
		}

	}

componentDidMount() {
		art.getArt()
		.then((res) => {
			this.setState({artists: res},(next)=>{
				console.log("artists",this.state.artists)
					var ArtName = this.state.ArtName.slice();
					var ArtLocation = this.state.ArtLocation.slice();
					var ArtTitle = this.state.ArtTitle.slice();
					var ArtistName = this.state.ArtistName.slice();
					var ArtImage = this.state.ArtImage.slice();
					var ArtWeb = this.state.ArtWeb.slice();

				var latLong = this.state.artists.map(artist =>{
    				ArtName.push(artist['Art Location Name']); 
    				ArtLocation.push(artist['Art Location Street Address'])
    				ArtTitle.push(artist['Art Title'])
    				ArtistName.push(artist['Artist Full Name'])
    				ArtImage.push(artist['Images'])
    				ArtWeb.push(artist['Web Detail Page'])
    				//console.log("what",artTitle)
			
    		var stillNotFormatted = artist.Location.split('(')[1]
    		var slicedInfo = stillNotFormatted.slice(0,stillNotFormatted.length-1)
    		var lat = Number(slicedInfo.split(',')[0])
    		var lon = Number(slicedInfo.split(',')[1])
    		var latLon = {lat:lat,lng:lon}
    		return latLon
    		})
				this.setState({ArtName},function(){
					this.setState({ArtLocation},function(){
							this.setState({ArtTitle},function(){
									this.setState({ArtistName},function(){
											this.setState({ArtImage},function(){
													this.setState({ArtWeb},function(){
														this.setState({artistLat:latLong})
				})

				})


				})
			
				})
			
				})
			

				})
				
				

			})


		})
	}

	render() {
		return (
      <div>
        	<NavBar />
    		<h3>Artist List </h3>
    		{this.state.artistLat.length>0?<TheMap artists = {this.state.artistLat} artName = {this.state.ArtName} artLocation = {this.state.ArtLocation} artTitle = {this.state.ArtTitle} artistName = {this.state.ArtistName} artWeb = {this.state.ArtWeb} artImage = {this.state.ArtImage}/>:null}

  		</div>
    )
	}

	}
