angular.module('hypercube.aws', ['ngStorage', 'hypercube.auth'])
.service('$aws', ['$log', '$sessionStorage', '$q', '$rootScope', function ($log, $sessionStorage, $q, $rootScope){
	this.region = 'us-east-1';
	this.cognito = {
		poolId:'us-east-1:7f3bc1ff-8484-48dd-9e13-27e5cd3de982',
		params:{
			RoleArn:'arn:aws:iam::823322155619:role/Cognito_HypercubeTestAuth_Role1'
		} 
	};
	this.getConfig=function(){
		var d = $q.defer();
	  AWS.config.credentials.get(function(err) {
		  if (err) {
		  	$log.log("[$s3.getObject()] Error ", err);
		  	d.reject(err);
		  }
		  else {
		  	d.resolve(AWS.config.credentials);
		  }
		});
		return d.promise;
	};
	this.updateConfig = function(){
		var self = this;
		AWS.config.update({
		  credentials: new AWS.CognitoIdentityCredentials({
		    IdentityPoolId: self.cognito.poolId
		  }),
		  region: self.region
		});
	};
}])
.service('$s3', ['$log', '$sessionStorage', '$q', '$aws', '$rootScope', function ($log, $sessionStorage, $q, $aws, $rootScope){
		this.getObjects = function(bucketName){
			var d = $q.defer();
			if(!bucketName){
		  	$log.error("[$s3.getObjects] Attempting to get objects for bucket without name.");
				d.reject({message:'Bucket name required to get objects'});
			} else {
				//If AWS Credential do not exist, set them
				if(typeof AWS.config.credentials == "undefined" || !AWS.config.credentials){
					// $log.info('AWS creds are being updated to make request');
					$aws.updateConfig();
				}
				var s3 = new AWS.S3();
				s3.listObjects({Bucket:bucketName}, function(err, data) {
				  if (err) { 
				  	$log.error("[$s3.getObjects] Error listing objects:", err);
					  d.reject(err);
					}
				  else {
				  	// $log.log("[$s3.getObjects] listObjects returned:", data);
				    d.resolve(data.Contents);
				  }
				});
			}
			return d.promise;
		};
		this.getFile = function(bucketName, fileKey){
			var d = $q.defer();
			if(!bucketName){
				d.reject({message:'Bucket name required to get objects'});
			}
			//If AWS Credential do not exist, set them
			if(typeof AWS.config.credentials == "undefined" || !AWS.config.credentials){
				// $log.info('AWS creds are being updated to make request');
				$aws.updateConfig();
			}
			var s3 = new AWS.S3();
			var getParams = {Bucket:bucketName, Key:fileKey};
			s3.getObject(getParams, function(err, data){
				if (err) {
					$log.error('Error getting file from s3:', err); // an error occurred
  				d.reject(err);
  			}
  			else {
					$log.warn('File loaded from s3:', data); // an error occurred
					d.resolve(data.Body.toString());
				}
			});
			return d.promise;
		};
		this.saveFile = function(fileData){
		  var d = q.defer();
		  var saveParams = {Bucket:bucketName, Key:fileData.key,  Body: fileData.content, ACL:'public-read'};
		  //Set contentType from fileData to ContentType parameter of new object
		  if(_.has(fileData, 'contentType')){
		  	saveParams.ContentType = fileData.contentType;
		  }
		  // $log.log('[$aws.$saveFiles] saveParams:', saveParams);
		  s3.putObject(saveParams, function(err, data){
		  	//[TODO] Add putting object ACL (make public)
		    if(!err){
		      $log.log('[$aws.saveFile()] file saved successfully. Returning:', data);
		      d.resolve(data);
		    } else {
		      $log.error('[$aws.saveFile()] Error saving file:', err);
		      d.reject(err);
		    }
		  });
		  return d.promise;
		};
}])