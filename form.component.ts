import { Input, Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Chart} from 'chart.js';
import { Title, BrowserTransferStateModule } from '@angular/platform-browser';
import { ModalDirective } from 'bootstrap';
import {NgbModal,NgbModalConfig, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import './tweet.js';
import{ Renderer } from '@angular/core';
import { JsonPipe } from '@angular/common';



// import { TLSSocket } from 'tls';
// import { url } from 'inspector';

@Injectable()
export class getService {
  constructor(private http: HttpClient) { }

}

 
// export class ConfigService {
//   constructor(private http: HttpClient) { }
//   url = 'http://localhost:4000';
//   getCharacters() {
//     return this
//             .http
//             .get(`${this.url}/characters`);
//   }
// }
@Injectable()
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class FormComponent implements OnInit {

  @Input() text:any;

  @ViewChild('myModal', {static: false}) myModal:ModalDirective;
  @ViewChild('modalButton', {static: false}) modalButton:ElementRef;
  @ViewChild('favoriteTable', {static: false}) favoriteTable:ElementRef;
  @ViewChild('test', {static: false}) test:ElementRef;
  @ViewChild('temperatureCanvas', {static: false}) temperatureCanvas:ElementRef;
  @ViewChild('pressureCanvas', {static: false}) pressureCanvas:ElementRef;
  @ViewChild('humidityCanvas', {static: false}) humidityCanvas:ElementRef;
  @ViewChild('ozoneCanvas', {static: false}) ozoneCanvas:ElementRef;
  @ViewChild('visibilityCanvas', {static: false}) visibilityCanvas:ElementRef;
  @ViewChild('windSpeedCanvas', {static: false}) windSpeedCanvas:ElementRef;
  @ViewChild('weeklyCanvas', {static: false}) weeklyCanvas:ElementRef;
  @ViewChild('ischec', {static: false}) ischeckElf:ElementRef;

  public ctx: CanvasRenderingContext2D;

  closeResult: string;
  public apiUrl='';

  constructor(
    private modalService: NgbModal, 
    private http: HttpClient,
    private  el: ElementRef,
    private renderer: Renderer
    ) { }
  public location:any={
    street:'',
    city:'',
    state:''
  }

  public isDisabled="false";

  public temp='';
  public stateList=['LA','NY'];
  public ischeck = false;
  public isvalid = 'is-valid';

  public geo:any={
    lat : 0,
    lng : 0
  }
  geocodeUrl = "/geocode?city="+ this.location.city + "&street=" + this.location.street + "&state=" + this.location.state;
  weatherUrl = "/forecast?lat=33.7263309&lng=-118.3077098";
  arr:any;
  weatherJson:any;
  infoDisplay = "none";
  public zeroDisplay="none";
  public halfDisplay="none";
  public invalidInputDisplay="none";
  public noRecordsDisplay="none";
  public jsonTmp:any;

  //Current
  public current:any={
    timezone:"",
    temperature:"",
    summary:"",
    humidity:"",
    pressure:"",
    windSpeed:"",
    visibility:"",
    cloudCover:"",
    ozone:""
  }

  public statePic;

  public chart=[];

  public hourly:any={
    temperature:[],
    pressure:[],
    humidity:[],
    ozone:[],
    visibility:[],
    windSpeed:[]
  };
  public temperatureChart:any ;
  public pressureChart:any ;
  public humidityChart:any ;
  public ozoneChart:any ;
  public visibilityChart:any ;
  public windSpeedChart:any ;
  public weekly:any=[];
  public weeklyDate:any=[];
  public weeklyTimeStamp:any=[];
  public weeklyChart:any;
  public isVisible:any=false;

  public modalInfo:any={
    date:"N/A",
    city:"N/A",
    temperature:"N/A",
    summary:"N/A",
    icon:"N/A",
    precipitation:"N/A",
    chanceOfRain:"N/A",
    windSpeed:"N/A",
    humidity:"N/A",
    visibility:"N/A"
  }



  public iconUrls={
    "clear-day":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png",
	  "clear-night":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png",
		"rain":"https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png",
		"snow":"https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png",
		"sleet":"https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png",
		"wind":"https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png",
		"fog":"https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png",
		"cloudy":"https://cdn3.iconfinder.com/data/icons/weather-344/142/cloud-512.png",
		"partly-cloudy-day":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png",
		"partly-cloudy-night":"https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png"
  }

  public tweetUrl="https://twitter.com/intent/tweet?text=The current temperature at city is temperature. The weather conditions are summary.&hashtags=CSCI571WeatherSearch";


  //favorite part
  public favoriteArr=[];
  public favoriteIsVisible='none';
  public resultButtonColor='rgb(78, 145, 184)';
  public resultButtonFontColor='white';
  
  public favoriteButtonColor='white';
  public favoriteButtonFontColor='rgb(78, 145, 184)';
  // public favoriteButtonsVisible='';

  public startUrl="../../baseline_star_border_black_48dp.png"
  public myStorage = window.localStorage;

  public favoriteInnerHtml='<li class="col-xs-12 col-sm-12 col-md-12 ">  \
  <div class="col-xs-1 col-sm-1 col-md-1 ">#</div>  \
  <div class="col-xs-2 col-sm-2 col-md-2">Image</div>  \
  <div class="col-xs-3 col-sm-3 col-md-3">City</div>  \
  <div class="col-xs-3 col-sm-3 col-md-3">State</div>  \
  <div class="col-xs-2 col-sm-2 col-md-2">Favorites</div>  \
</li>';

  public isFirst=true;





















  ngOnInit() {
    // this.myModal.modal('show');
    this.getStateArr();
    // this.ischeckElf.nativeElement.onClick=function(){
    //   console.log('click');
    //   this.isDisabled = !this.isDisabled;
    // }

    this.renderer.listen(this.ischeckElf,'onchange',(event)=>{
      // console.log(event);
      console.log('click');
      this.isDisabled = this.isDisabled == 'false'? 'true':'false';


    });

  }


  doSubmit(){

  }

  getStateArr(){
    var that = this;
    var url = "/stateList";
    // window.alert(formData)

    this.http.get(url).toPromise().then(data => 
      {
        console.log(data);
        var list = data["States"];
        for (var i  = 0; i < list.length;i++){
            that.stateList[i] = list[i]["State"];
        }

        console.log(that.stateList);

      });
  }



  getGeo(){
    this.geocodeUrl = "/geocode?city="+ this.location.city + "&street=" + this.location.street + "&state=" + this.location.state;
    const formData = this.location;
    // window.alert(formData)

    this.http.get(this.geocodeUrl,formData).toPromise().then(data => 
      {
        this.geo.lat = data[0],
        this.geo.lng = data[1]
        // window.alert(this.geo.lat);
        this.doWeatherSearch();

      });
  }

  getCur(){
    this.geocodeUrl = "http://ip-api.com/json";
    // window.alert(formData)

    this.http.get(this.geocodeUrl).toPromise().then(data => 
      {
        this.geo.lat = data['lat'],
        this.geo.lng = data['lon'],
        this.location.city = data['city'],
        // window.alert(this.geo.lat),
        this.doWeatherSearch()

      });
  }


  doWeatherSearch(){
    this.weatherUrl = "/forecast?lat=" + this.geo.lat + "&lng=" + this.geo.lng;

    this.http.get(this.weatherUrl).toPromise().then(data => {
      this.jsonTmp = data;
      //  window.alert(this.weatherUrl)
      this.current.timezone = data['timezone'];
      // this.current.timezone = "<h>aa</h>";
      var cur = data['currently'];
      this.current.temperature = cur['temperature'];
      // window.alert(this.current.temperature);
      this.current.summary = cur['summary'];
      this.current.humidity = cur['humidity'];
      this.current.pressure = cur['pressure'];
      this.current.windSpeed = cur['windSpeed'];
      this.current.visibility = cur['visibility'];
      this.current.cloudCover = cur['cloudCover'];
      this.current.ozone = cur['ozone'];


    });

    var statePicUrl = "/statePic?state=" + this.location.city;
    this.http.get(statePicUrl).toPromise().then(data => {
      this.statePic = data['items'][0]['link'];
      // console.log(data);
    });

  }

  doSearch(){
    this.favoriteIsVisible = 'none';
    if(this.ischeck==false&&(this.location.city==''||this.location.street=='')){
      console.log('invalid');
      this.doClear();
      return ;
    }
    this.noRecordsDisplay = 'none';
    var that = this;

    if (this.ischeck){
      this.getCur();
    }
    else{
      this.getGeo();
    }

let promise = new Promise(function(resolve, reject){
  that.zeroDisplay = "";
  that.doHourlySearch();
  setTimeout(function () {
    console.log('00000');
    that.doWeeklySearch();
    // resolve('success')
  }, 1000);

  setTimeout(function () {
    console.log('11111');
    that.doCharts();
    that.zeroDisplay = "none";
    that.halfDisplay = "";
  }, 2000);

  setTimeout(function () {
    console.log('22222');
    that.doInit();
    that.halfDisplay = "none";
    that.infoDisplay = "";
  }, 3000);

  resolve();
});
// promise.then(function(){
//   console.log("resolved");
//   // that.tweetUrl="https://twitter.com/intent/tweet?text=The current temperature at " + that.location.city + " is " + that.current.temperature + ". The weather conditions are "+ that.current.summary +". &hashtags=CSCI571WeatherSearch";
//   that.doInit();
// });

    // this.doHourlySearch();
    // this.doWeeklySearch();
    // this.doCharts();
    // this.doInit();
    // var num = 0;
    // while(this.location.city=='' &&num < 1000){num++;console.log(this.location.city)};
    
  


  }

  doInit(){
    console.log("tweetCity:  "+this.location.city);
    this.tweetUrl="https://twitter.com/intent/tweet?text=The current temperature at " + this.location.city + " is " + this.current.temperature + ". The weather conditions are "+ this.current.summary +". &hashtags=CSCI571WeatherSearch";
    if (this.myStorage.hasOwnProperty(this.location.city)){
      console.log('have city');
      this.startUrl="../../baseline_star_black_48dp.png";
    }
    else{
      console.log('not have city');
      this.startUrl="../../baseline_star_border_black_48dp.png";
    }
  }

  doClear(){
    this.location.city = '';
    this.location.state = '';
    this.location.street = '';
    this.isVisible = false;
    this.infoDisplay = 'none';
    this.doResults();
    this.ischeck = false;
    this.noRecordsDisplay = 'none';
    this.invalidInputDisplay = 'none';
  }


  doHourlySearch(){
    var date = new Date();
    console.log(this.geo.lat);
    var hourlyUrl = "/hourly?lat=" + this.geo.lat +"&lng="+ this.geo.lng;
    this.http.get(hourlyUrl).toPromise().then(data => 
      {
        if (data =='error'){

        };
        var tmpdata = data['hourly']['data'];
        for ( var i = 0; i < 24;i++){
          this.hourly.temperature[i] = tmpdata[i*2]["temperature"];
          this.hourly.pressure[i] = tmpdata[i*2]["pressure"];
          this.hourly.humidity[i] = tmpdata[i*2]["humidity"];
          this.hourly.windSpeed[i] = tmpdata[i*2]["windSpeed"];
          this.hourly.visibility[i] = tmpdata[i*2]["visibility"];
          // this.hourly.cloudCover[i] = tmpdata[i*2]["cloudCover"];
          this.hourly.ozone[i] = tmpdata[i*2]["ozone"];
            
        }
      });
  }


  doWeeklySearch(){
    var date = new Date();
    // hourly url equal to weekly url
    var weeklyUrl = "/hourly?lat=" + this.geo.lat +"&lng="+ this.geo.lng;
    this.http.get(weeklyUrl).toPromise().then(data => 
      {
        var tmpdata = data['daily']['data'];
        for ( var i = 0; i < 7;i++){
          this.weekly[i]=new Array( tmpdata[i]["temperatureMin"], tmpdata[i]["temperatureMax"]);
          
          var time = new Date(1000*tmpdata[i]["time"]);

          this.weeklyDate[i] = (time.getDate()) + '/' + (time.getMonth()+1) + '/' + time.getFullYear();
          this.weeklyTimeStamp[i] = tmpdata[i]["time"];

        }
      });
  }


  can:any;
  // ctx:any;
  doCharts(){
    console.log("firstweeklydate:           "+this.weeklyDate);
    var that = this;
    this.tweetUrl="https://twitter.com/intent/tweet?text=The current temperature at " + this.location.city + " is " + this.current.temperature + ". The weather conditions are "+ this.current.summary +". &hashtags=CSCI571WeatherSearch";

  if (this.isFirst){/////////////////////////////////////////
    this.isFirst = false;
    this.can = this.temperatureCanvas;
    this.ctx = (<HTMLCanvasElement>this.temperatureCanvas.nativeElement).getContext('2d'); 
    this.temperatureChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          // labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
          datasets: [{
              label: 'temperature',
              // data: this.hourly.temperature,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 1,
          }]
      },
      options: {
        title:{
          position:'bottom',
          display:true,
          text:'Time difference from current hour'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Fahrenheit'
            }
          }]
        }
      }
    });

    this.can = this.pressureCanvas;
    this.ctx = (<HTMLCanvasElement>this.pressureCanvas.nativeElement).getContext('2d');  
    this.pressureChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          // labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
          datasets: [{
              label: 'pressure',
              // data: this.hourly.pressure,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 1,
          }]
      },
      options: {
        title:{
          position:'bottom',
          display:true,
          text:'Time difference from current hour'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Millibars'
            }
          }]
        }
      }
    });

    this.can = this.humidityCanvas;
    this.ctx = (<HTMLCanvasElement>this.humidityCanvas.nativeElement).getContext('2d'); 
    this.humidityChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          // labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
          datasets: [{
              label: 'humidity',
              // data: this.hourly.humidity,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 1,
          }]
      },
      options: {
        title:{
          position:'bottom',
          display:true,
          text:'Time difference from current hour'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: '% Humidity'
            }
          }]
        }
      }
    });

    this.can = this.ozoneCanvas;
    this.ctx = (<HTMLCanvasElement>this.ozoneCanvas.nativeElement).getContext('2d'); 
    this.ozoneChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          // labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
          datasets: [{
              label: 'ozone',
              // data: this.hourly.ozone,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 1,
          }]
      },
      options: {
        title:{
          position:'bottom',
          display:true,
          text:'Time difference from current hour'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Dobson Units'
            }
          }]
        }
      }
    });


    // this.can = document.getElementById('visibilityCanvas');
    this.can = this.visibilityCanvas;
    this.ctx = (<HTMLCanvasElement>this.visibilityCanvas.nativeElement).getContext('2d'); 
    this.visibilityChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          // labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
          datasets: [{
              label: 'visibility',
              // data: this.hourly.visibility,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 1,
          }]
      },
      options: {
        title:{
          position:'bottom',
          display:true,
          text:'Time difference from current hour'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Miles'
            }
          }]
        }
      }
    });

    this.can = document.getElementById('windSpeedCanvas');
    this.ctx = this.can.getContext('2d'); 
  // this.ctx.clearRect(0, 0,this.ctx.canvas.width,this.ctx.canvas.height);

    
    this.windSpeedChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
          // labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
          datasets: [{
              label: 'windSpeed',
              // data: this.hourly.windSpeed,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 1,
          }]
      },
      options: {
        title:{
          position:'bottom',
          display:true,
          text:'Time difference from current hour'
        },
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Miles per hour'
            }
          }]
        }
      }
    });



    var that = this;//备份外部对象
    this.can = this.weeklyCanvas;
    this.ctx = (<HTMLCanvasElement>that.weeklyCanvas.nativeElement).getContext('2d'); 


    that.weeklyChart = new Chart(this.ctx, {
      type: 'horizontalBar',
      data: {
          labels: [0,1,2,3,4,5,6],//this.weeklyDate,
          datasets: [{
              label: 'weekly',
              data: [0,1,2,3,4,5,6],//this.weekly,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 0.5)',
              borderWidth: 1,
          }]
      },
      options: {
        responsive:true,
        title:{
          position:'bottom',
          display:true,
          text:'Time difference from current hour'
        },
        scales: {
          xAxes: [{
            gridLines: {
                display:false,
                scaleLabel: {
                  display: true,
                  labelString: 'Time difference from current hour'
                }
            }
          }],
          yAxes: [{
            gridLines: {
              display:false
          } ,
            scaleLabel: {
              display: true,
              labelString: 'Days'
            }
          }]
        },
        tooltips:{

          displayColors:false,
          title:false,
          // model:'label',
          callbacks: {
            title:function(tooltipItem,data){
              return '';
            },
            label: function(tooltipItem, data) {
                return tooltipItem.yLabel + ": "+Math.round( data['datasets'][0]['data'][tooltipItem['index']][0]) +" to " +Math.round(data['datasets'][0]['data'][tooltipItem['index']][1] );
            }
          }
          // ,
          // onClick:function(tooltipItem,data){
          //   window.alert();
          //   console.log(tooltipItem.yLabel);
          // }
          
  
        }
        
        // ,
        // onClick:function(evt){
        //   // console.log(doSpecificTimeSearch;
          
        //   var  source = this.weeklyChart.getElementAtEvent(evt)[0]; 

        //   var data = source._chart.data; 
        //   var datasetIndex = source._datasetIndex;
        //             console.log("index       "+datasetIndex);
        //   var timeArr = data.labels[datasetIndex].split('/');
        //   var timeStamp = this.weeklyTimeStamp[datasetIndex];
        //   // console.log(timeStamp);
        //   var weeklyUrl = "http://571hw-env-8.us-west-1.elasticbeanstalk.com:8888/specificTime?lat=" + that.geo.lat +"&lng="+ that.geo.lng +"&time=" + timeStamp;

        //   that.doSpecificTimeSearch(timeStamp);

           
        // }

                
      }

    });
    

    // removeData(windSpeedChart);
    // windSpeedChart.update();
  }//////////////////////////////////////
  function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
  }
  
  function removeData(chart) {
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
          dataset.data.pop();
      });
      chart.update();
  //     console.log(JSON.stringify("0000000000000"+ windSpeedChart.dataset));

  }
  for (var i =0;i < 24;i ++){
    
    removeData(this.temperatureChart);
    removeData(this.pressureChart);
    removeData(this.humidityChart);
    removeData(this.ozoneChart);
    removeData(this.visibilityChart);
    removeData(this.windSpeedChart);

  }
  for (var i =0;i < 24;i ++){
    // console.log('hourly:'+JSON.stringify(this.hourly));

    addData(this.temperatureChart,i,this.hourly.temperature[i]);
    addData(this.pressureChart,i,this.hourly.pressure[i]);
    addData(this.humidityChart,i,this.hourly.humidity[i]);
    addData(this.ozoneChart,i,this.hourly.ozone[i]);
    addData(this.visibilityChart,i,this.hourly.visibility[i]);
    addData(this.windSpeedChart,i,this.hourly.windSpeed[i]);
    
  }
  for (var i =0;i < 7;i ++){
    removeData(this.weeklyChart);
  }
  // console.log('weeklyDate:     '+that.weeklyDate);
  // console.log('weekly:     '+this.weekly);
  console.log(this.weeklyChart);
  for (var i =0;i < 7;i ++){
    addData(this.weeklyChart,this.weeklyDate[i],this.weekly[i]);

  }
  console.log(this.weeklyChart);
  this.weeklyChart.options.onClick=(e)=>{
    console.log(e);

    var  source = that.weeklyChart.getElementAtEvent(e)[0]; 
    console.log(that.weeklyChart.getElementAtEvent(e)[0]._index);
    var data = source._chart.data; 

    // var datasetIndex = source._datasetIndex;
    var datasetIndex = source._index;
    console.log("source:       "+datasetIndex);
    var timeArr = data.labels[datasetIndex].split('/');
    var timeStamp = that.weeklyTimeStamp[datasetIndex];
    // console.log("date:     "+JSON.parse(data.labels[datasetIndex]));
    console.log('timestamp:     '+timeStamp);
    var weeklyUrl = "/specificTime?lat=" + that.geo.lat +"&lng="+ that.geo.lng +"&time=" + timeStamp;
    

    that.doSpecificTimeSearch(timeStamp);

    }
  




    
    // that.weeklyChart.config.data =this.weekly;
    // that.weeklyChart.update();

  }







  doSpecificTimeSearch(time){

    var weeklyUrl = "/specificTime?lat=" + this.geo.lat +"&lng="+ this.geo.lng +"&time=" + time;
    this.http.get(weeklyUrl).toPromise().then(data => 
      {

        var time = new Date(data["daily"]["data"][0]["time"]*1000);
        this.modalInfo.date  = (time.getDate()) + '/' + (time.getMonth()+1) + '/' + time.getFullYear();

        this.modalInfo.city=this.location.city;
        this.modalInfo.temperature=data["currently"]["temperature"];
        this.modalInfo.summary=data["currently"]["summary"];
        var iconTmp = data["currently"]["icon"];
        this.modalInfo.icon=this.iconUrls[iconTmp];
        this.modalInfo.precipitation=data["currently"]["precipIntensity"]==null?'N/A':(data["currently"]["precipIntensity"]);
        this.modalInfo.chanceOfRain=data["currently"]["precipProbability"]==null?'N/A':(data["currently"]["precipProbability"]+' %');
        this.modalInfo.windSpeed=data["currently"]["windSpeed"]==null?'N/A':(Math.round(100 * data["currently"]["windSpeed"]) / 100.0 +' mph');
        this.modalInfo.humidity=data["currently"]["humidity"]==null?'N/A':(Math.round(100 * 100*data["currently"]["humidity"])/100.0+' %');
        this.modalInfo.visibility=data["currently"]["visibility"]==null?'N/A':(data["currently"]["visibility"]+' miles');
        
        
        this.modalButton.nativeElement.click();
        

        // console.log(data); 

      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }


  display:any='block';
  openModal(){

          this.display='block';
    
  }
  onCloseHandled(){

          this.display='none';
    
  }

  ngAfterViewInit(){
    // this.modalButton.nativeElement.click();



  }


  doFavorite(){
    if (this.myStorage.hasOwnProperty(this.location.city)){
      // delete this.favouriteArr[this.location.city];
      console.log("dofavorite have city"+this.myStorage.getItem(this.location.city));
      this.startUrl="../../baseline_star_border_black_48dp.png";

      this.myStorage.removeItem(this.location.city)
      

    }
    else{
      this.favoriteArr[this.location.city] = this.location.state;
      this.startUrl="../../baseline_star_black_48dp.png";

      var obj:{city:string,state:string,statePicUrl:string}= {
        city:this.location.city,
        state:this.location.state,
        statePicUrl:this.statePic
      };
      var json = JSON.stringify(obj);
      this.myStorage.setItem(this.location.city,json);
    }
    // console.log(this.favouriteArr);
    // console.log(this.location.city);
  }

  showFavorite(){
    var that = this;
    if (this.favoriteButtonColor == 'white'){
      this.resultButtonColor='white';
      this.resultButtonFontColor='rgb(78, 145, 184)';
      
      this.favoriteButtonColor='rgb(78, 145, 184)';
      this.favoriteButtonFontColor='white';
    }
    this.infoDisplay='none';
    var key=JSON.stringify(localStorage);
    console.log(key);
    if(key=="{}"){
      console.log('kong');
      this.favoriteIsVisible = 'none';
      this.noRecordsDisplay = '';
    }
    else{
      console.log("bukong");
      this.noRecordsDisplay = 'none';
      this.favoriteIsVisible = '';  
      // this.favoriteTable.nativeElement.innerHtml="";
      // this.favoriteTable.nativeElement.innerHtml+=
      this.favoriteInnerHtml =
      '<li class="col-xs-12 col-sm-12 col-md-12">  \
        <div class="col-xs-1 col-sm-1 col-md-1 ">#</div>  \
        <div class="col-xs-2 col-sm-2 col-md-2">Image</div>  \
        <div class="col-xs-3 col-sm-3 col-md-3">City</div>  \
        <div class="col-xs-3 col-sm-3 col-md-3">State</div>  \
        <div class="col-xs-2 col-sm-2 col-md-2">Favorites</div>  \
      </li>'
      for(var i=0; i<localStorage.length;i++){
        var json = JSON.parse(this.myStorage.getItem(this.myStorage.key(i)));
        // console.log('key:'+this.myStorage.key(i));
        // console.log('jsonfile'+json['city']);
        var city = json['city'].replace(/\s+/g,"");
        var state = json['state'].replace(/\s+/g,"");
        var statePicUrl = json['statePicUrl'];
        this.favoriteInnerHtml +=
        // this.favoriteTable.nativeElement.innerHtml+=
        '<li class="col-xs-12 col-sm-12 col-md-12 '+ city+' ">  \
          <div class="col-xs-1 col-sm-1 col-md-1 ">'+ (i+1) +'</div>  \
          <div class="col-xs-2 col-sm-2 col-md-2"><img width="80px" height="50px" src="' + statePicUrl +'"></div>  \
          <div class="col-xs-3 col-sm-3 col-md-3">' + city + '</div>  \
          <div class="col-xs-3 col-sm-3 col-md-3">'+ state + '</div>  \
          <i class="asa material-icons orange600" > delete </i>  \
        </li>';

        
      }

      // console.log("favoriteInnerHtml:   "+this.favoriteInnerHtml);
      setTimeout(function () {
        that.doTableButtons();
      }, 1000);
      // console.log('111111'+this.favoriteTable.nativeElement.querySelector('li'+city));
      // console.log('22222'+this.favoriteTable.nativeElement.querySelector('li'+city).querySelector(".asa"));
      // var deleteButton = this.favoriteTable.nativeElement.querySelector('li'+city).querySelector(".asa");
      // this.renderer.listen(deleteButton,'click',(event)=>{
      //     console.log(event);
      //     console.log("delete"+city);
      //   });

    }
  }


doTableButtons(){
  var that = this;
  setTimeout(() => {
    for(var i=0; i<localStorage.length;i++){
      var json = JSON.parse(this.myStorage.getItem(this.myStorage.key(i)));
      var city = json['city'].replace(/\s+/g,"");
      var state = json['state'].replace(/\s+/g,"");
      var statePicUrl = json['statePicUrl'];
    // var deleteButton = this.favoriteTable.nativeElement.querySelector('li');
      console.log(this.favoriteTable.nativeElement);
      console.log(this.favoriteTable.nativeElement.querySelector('.'+city));
      console.log(this.favoriteTable.nativeElement.querySelector('.'+city).querySelector(".asa"));
      var deleteButton = (this.favoriteTable.nativeElement.querySelector('.'+city).querySelector(".asa"));

      this.renderer.listen(deleteButton,'click',(event)=>{
        // console.log(event);
        console.log("delete"+json['city']);
        this.myStorage.removeItem(json['city']);
        // console.log(this.myStorage);
        this.showFavorite();


      });

    // this.renderer.listen(deleteButton,'click',(event)=>{
    //   console.log(event);
    //   console.log("delete"+city);
    // });
    // console.log("favorInnerHtml:       "+that.favoriteInnerHtml);
    // console.log(this.favoriteTable.nativeElement.querySelector(''));
    }
    });
    
}



  doDelete(){
    console.log("delete");
  }





  doResults(){
    if (this.resultButtonColor='white'){
      this.resultButtonColor='rgb(78, 145, 184)';
      this.resultButtonFontColor='white';
    
      this.favoriteButtonColor='white';
      this.favoriteButtonFontColor='rgb(78, 145, 184)';
    }
    this.favoriteIsVisible = 'none';
    this.noRecordsDisplay='none';
  }




  // var app=angular.module("app",[]);

  // var carController=function($scope){
  //     $scope.data=[
  //         {
  //             id:1,
  //             name:'HuaWei',
  //             quantity:'2',
  //             price:4300
  //         },
  //         {
  //             id:2,
  //             name:'iphone7',
  //             quantity:'3',
  //             price:6300
  //         },
  //         {
  //             id:3,
  //             name:'XiaoMi',
  //             quantity:'3',
  //             price:2800
  //         },
  //         {
  //             id:4,
  //             name:'Oppo',
  //             quantity:'3',
  //             price:2100
  //         },
  //         {
  //             id:5,
  //             name:'Vivo',
  //             quantity:'3',
  //             price:2100
  //         }
  //     ]
  // }











}
