import React, {Component} from 'react'
import {View, Text, ScrollView, Picker, ActivityIndicator, TextInput, ImageBackground} from 'react-native-web'
import PickerItem from "react-native-web/dist/exports/Picker/PickerItem";
import axios from "axios"

export default class App extends Component{
  state={selectedCurrency: "USD", selectedCurrencyAmount: 1, secondCurrency: "EUR", secondCurrencyAmount: 0, multipler: 0, is_loading: true, currencyData: []}
  componentDidMount() {
    this.getExchangeData()
  }

  getExchangeData(){
    this.setState({is_loading: true})
    axios.get("https://api.exchangerate-api.com/v4/latest/"+this.state.selectedCurrency).then((data) => {
      if(data.status === 200){
        var multipler = 0
        Object.entries(data.data.rates).map((items, id) => {
          if(items[0] == this.state.secondCurrency){
            multipler = items[1]
          }
        })
        this.setState({currencyData: data.data.rates, multipler: multipler, is_loading: false})
      }else{
        alert("Hata")
      }
    })
  }

  render(){
    return(
        <ScrollView contentContainerStyle={{flex: 1, alignItems:'center', backgroundColor:'#F0F0F0'}}>
          <ImageBackground style={{flex: 1, width: "100%", alignItems:'center'}} source={require('./bg.jpg')}>
            <View style={{backgroundColor:'#2196F3', width: "100%", padding:20}}>
              <Text style={{color:'white', fontSize: 20}}>React Native Web Exchange Rate</Text>
            </View>{this.state.is_loading === false?
              <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                <View style={{justifyContent:'center', alignItems:'center', paddingVertical:20, paddingHorizontal: 10,backgroundColor:'rgba(0,0,0,0.5)'}}>
                  <Text style={{color:'white', fontSize: 18, fontWeight:'bold', marginTop: 20, marginBottom: 10}}>SELECT CURRENCY</Text>
                  <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
                    <TextInput onChangeText={(text) => {
                      const temp = parseInt(text)
                      if(text.length > 0){
                        if(!isNaN(temp)){
                          this.setState({selectedCurrencyAmount: temp})
                        }else{
                          alert("nan")
                        }
                      }
                    }} style={{width: 150, height: 50, backgroundColor: '#FFFFFF', justifyContent:'center', alignItems:'center', textAlign:'center'}} defaultValue={this.state.selectedCurrencyAmount} keyboardType={"numeric"} />
                    <Picker onValueChange={(itemValue, itemIndex) => {
                      this.setState({selectedCurrency: itemValue}, () => this.getExchangeData())
                    }}  selectedValue={this.state.selectedCurrency} style={{height: 50, width: 70, textAlign:'center', justifyContent:'center', alignItems:'center'}}>
                      {this.renderCurrencies()}
                    </Picker>
                    <TextInput style={{width: 150, height: 50, backgroundColor: '#FFFFFF', justifyContent:'center', alignItems:'center', textAlign:'center'}} editable={false} value={this.state.selectedCurrencyAmount*this.state.multipler} keyboardType={"numeric"} />
                    <Picker onValueChange={(itemValue, itemIndex) => {
                      let multipler = 1
                      Object.entries(this.state.currencyData).map((items, id) => {
                        if(items[0] == itemValue){
                          multipler = items[1]
                        }
                      })
                      this.setState({secondCurrency: itemValue, multipler: multipler})
                    }} selectedValue={this.state.secondCurrency} style={{height: 50, width: 70, textAlign:'center', justifyContent:'center', alignItems:'center'}}>
                      {this.renderCurrencies()}
                    </Picker>
                  </View>
                </View>
              </View>:
              <View style={{width: "100%", height: 400, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size={"large"} />
              </View>
          }
          </ImageBackground>


        </ScrollView>
    )
  }

  renderCurrencies(){
    return Object.entries(this.state.currencyData).map((items, id) =>
        <PickerItem label={items[0]} value={items[0]} />
    )
  }
}
