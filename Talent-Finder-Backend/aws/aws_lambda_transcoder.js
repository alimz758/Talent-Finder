var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  apiVersion: '2012–09–25'
});
var eltr = new AWS.ElasticTranscoder({
  apiVersion: '2012–09–25',
  region: 'us-west-1'
});
//reverse a string
function reverseString(str) {
    var splitString = str.split(""); 
    var reverseArray = splitString.reverse(); 
    var joinArray = reverseArray.join(""); 
    return joinArray; 
}
exports.handler = function(event, context) {
  var bucket = event.Records[0].s3.bucket.name;
  var key = event.Records[0].s3.object.key;
  var pipelineId = '';//put your aws pipeline ID
  
  if (bucket !== 'YOUR_SOURCE_BUCKET') {
    context.fail('Incorrect input bucket');
    return;
  }
  
  var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); 
  var newKey = reverseString( reverseString(srcKey).slice(4));//reformat the input key to be used for thumbnail
  var params = {
    PipelineId: pipelineId,
    OutputKeyPrefix:  'optmized-video/',//prefix to be used for all optimzed videos
    Input: {
      Key: srcKey,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto'
    },
    Outputs: [{
      Key: srcKey,//use the same format for the output key
      ThumbnailPattern:  newKey + '-{count}',//just addinng a counter for the thumbnail, i found out AWS doesn't allow you to not use it!!
      PresetId: '1351620000001-100020',//for mobile and tablet devices: check AWS PresetIDs for more info
      Watermarks: [],
    }]
  };
 
  console.log('Starting a job');
  eltr.createJob(params, function(err, data) {
    if (err){
      console.log(err);
    } else {
      console.log(data);
    }
    context.succeed('Job successfully completed');
  });
};