import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Alert,
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MusicFiles from 'react-native-get-music-files';
import Permissions from 'react-native-permissions';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
          songs:'',
            permissionStatus:'',
            photoPermission:''
        };
    }

    componentDidMount() {
       Permissions.check('storage').then(response => {
         // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
         this.setState({ photoPermission: response })
       });
     }


     _requestPermission = () => {
       Permissions.request('storage').then(response => {
         // Returns once the user has chosen to 'allow' or to 'not allow' access
         // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
         this.setState({ photoPermission: response })
       })
     }

     getSongs =() =>{
       Alert.alert('seen')
       MusicFiles.getAll({
          artist : true,
          duration : true, //default : true
          cover : false, //default : true,
          genre : true,
          title : true,
          fields : ['title','albumTitle','genre','lyrics','artwork','duration']
      }).then(tracks => {
        this.setState({songs:tracks})
      }).catch(error => {
      console.log(error)
      })
     }




    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                style={{backgroundColor:(this.state.photoPermission)==='authorized'?'green':'red', margin:20,borderRadius:10}}
                 onPress={this._requestPermission}>
                    <Text style={styles.txt}>Get permission</Text>
                    <Text>{this.state.permissionStatus}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.getSongs}
                style={{backgroundColor:'rgb(149, 97, 119)',borderRadius:10,padding:30}}>
                <Text style={styles.txt}>Get Songs</Text>
                </TouchableOpacity>
                    <FlatList
                      style={{backgroundColor:'#ddd',width:'100%'}}
                      data={this.state.songs}
                      keyExtractor={(item, index) => item.id}
                      renderItem={({item}) => <Player data={item} />}
                      />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        padding: 10,
    },

    musicContainer:{
       height:100,
       width:'100%',
       backgroundColor:'rgba(107, 129, 184, 0.82)',
       flexDirection:'row',
       borderBottomWidth:2,
       borderColor:'white'
     },
     txt:{
       color:'white'
     },
     row1:{
       margin:5,
     },
     iconWrap:{

       padding:10,
     },
     textWrap:{
       flexDirection:'column'
     }
});

class Player extends Component {
     render(){
       const {id,fileName,uri,duration} = this.props.data;
       return(
         <TouchableOpacity style={styles.musicContainer}
         onPress={(uri)=>{this.playSound(uri)}}>
            <View style={styles.iconWrap}>
                <Icon name="play" size={30} color="white" />
            </View>

      <View style={styles.textWrap}>
                <View style={styles.row1}>
                    <Text style={styles.txt}>{fileName}</Text>
                </View>

                    <View  style={styles.row1}>
                    <Text style={styles.txt} >{(duration/100).toFixed(2)}</Text>
                </View>
      </View>
         </TouchableOpacity>
         );
     }
   }
