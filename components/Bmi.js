import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Dimensions } from 'react-native';
import {firebaseApp} from '../firebase-config';
import axios from "axios";
import { HOST_URL } from '../commonConfig';

class Bmi extends React.Component {

  constructor(props) 
  {
    super(props);
    this.state = {height: '', weight: '', date: '', bmi: '', currentDate: new Date().getDate(),isLoading: false, error: ''}
  }

  addData = () =>
  {
    
    const user = {
        firstname: this.state.firstname,
        gender: this.state.gender,
        date: this.state.date,
        height: this.state.height,
        weight: this.state.weight,
        bmi: this.state.bmi
      }

      console.log("vgfgfu");
      const userId = firebaseApp.auth().currentUser.uid
      axios.post(HOST_URL + "userBmi/add", {
        height: this.state.height,
        weight: this.state.weight,
        date: new Date().getMonth()/new Date().getDate()/new Date().getFullYear(),
        userId: userId
      })
      .then(res => {
        alert("User data added succesfully");
        
        axios.put(HOST_URL + "userInfo?userId=" + userId, user)
        .then(res => {
            self.setState({ weight: res.data.weight});
        }).catch(function (error) {
          console.log("error", error);
        })
      }).catch(error =>{
        console.log(error);
      })   
 }


 componentDidMount() 
{
    this.fetchHeight();
}

 fetchHeight = () =>
{
    var self = this;
    firebaseApp.auth().onAuthStateChanged(function (user) {
    if (user) 
    {
        const userId = firebaseApp.auth().currentUser.uid;
        axios.get(HOST_URL + "userInfo/getbmiByUserId?userId=" + userId)
        .then(res => {
            self.setState({ height: res.data.height});
        }).catch(function (error) {
          console.log("error", error);
        })
    }
  });

}
  
  render()
  {
    return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.content}>

            <View style ={styles.topCardStyle}>
              <Text style={styles.dateText}>{new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()}</Text>
            </View>

            {/* Height */}
                <Text style={[styles.text_footer, { margin: 10 }, { fontSize: 15 }]}>Enter the Height(m)</Text>
                <TextInput style={styles.resultText} onChangeText={height => this.setState({ height })} value={this.state.height} />

            {/* Weight */}
            <Text style={[styles.text_footer, { margin: 10 }, { fontSize: 15 }]}>Enter the Weight(kg)</Text>
                <TextInput style={styles.resultText} onChangeText={weight => this.setState({ weight })} value={this.state.weight} />

                <View style={styles.submitbutton}>
                    <TouchableOpacity style={[styles.submit, {color: 'black'}]} onPress={() => this.addData()}>
                      <Text style={styles.submitbtnText}>Submit</Text>
                    </TouchableOpacity>    
                </View>
        </View>
      </View>
    </ScrollView>
  );
  }  
}


const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  resultText:
  {
      height: 50,
      borderWidth: 0.5,
      borderRadius: 5,
      padding: 10,
      borderColor: '#393838'
  },
  text_footer:
  {
      fontSize: 10,
  },
  cotent:
  {
      backgroundColor: '#fff',
  },

  submitbutton:
   {
     alignItems: 'center',
     marginTop: '2%',
   },

   submit:
  {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#EB6C3E'
  },

  submitbtnText:
  {
      color: '#fff',
      fontSize: 15,
  },

  topCardStyle:
  {
    marginTop: 5,
    width: deviceWidth-25,
    backgroundColor: "#fff",
    height: 40,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.25,
    elevation: 9,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  dateText:
  {
    fontSize: 16,  
    color: '#EB6C3E',
  },

});

export default Bmi;



