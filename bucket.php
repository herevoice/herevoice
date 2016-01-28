<!DOCTYPE HTML>
<html>
	<head> 
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" >
	</head>
	<body>
		<?php
		error_reporting(E_ALL);
		ini_set('display_errors','On');
		$uploaddir = '/tmp/';
		$uploadfile = $uploaddir . basename($_FILES['userfile']['name']);
		if (move_uploaded_file($_FILES['uploaded_file']['tmp_name'], $uploadfile)) {
		
		} else {
		
		}
		require '../vendor/autoload.php';

		use Aws\S3\S3Client;
		use Aws\Common\Aws;

		try{
		// Instantiate an S3 client
			$s3 = S3Client::factory(array(
			'version' => 'latest',
			'credentials' => array(
				'key' => 'AKIAI2V7Y4ZMJP324OMQ',
				'secret' => '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'
				),
			'region'=>'ap-northeast-1'
			));
		
		// Upload a publicly accessible file. File size, file type, and md5 hash are automatically calculated by the SDK
			$result = $s3->putObject(array(
			'Bucket' => "herevoice",
			'Key'    => $_FILES['uploaded_file']['name'],
			'SourceFile'   => $uploadfile,
			'ACL'    => 'public-read',
			'ContentType'=>mime_content_type($uploadfile)
			));

			} catch(S3Exception $e){
			print_r($e);
			}
			echo $result["ObjectURL"];
		?>
	</body>
</html>
