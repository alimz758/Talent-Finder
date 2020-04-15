var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  apiVersion: '2012–09–25'
});
var eltr = new AWS.ElasticTranscoder({
  apiVersion: '2012–09–25',
  region: 'us-west-1'
});
function reverseString(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]
 
    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]
 
    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"
    
    //Step 4. Return the reversed string
    return joinArray; // "olleh"
}
exports.handler = function(event, context) {
  var bucket = event.Records[0].s3.bucket.name;
  var key = event.Records[0].s3.object.key;
  var pipelineId = '';//put your aws pipeline ID
  
  if (bucket !== 'actfinder-videobucket') {
    context.fail('Incorrect input bucket');
    return;
  }
  
  var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); 
  var newKey = reverseString( reverseString(srcKey).slice(4));//reformat the input key to be used for thumbnail
  var params = {
    PipelineId: pipelineId,
    OutputKeyPrefix:  'optmized-video/',
    Input: {
      Key: srcKey,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto'
    },
    Outputs: [{
      Key: srcKey,
      ThumbnailPattern:  newKey + '-{count}',
      PresetId: '1351620000001-100020',
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