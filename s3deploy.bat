IF %1.==. GOTO No1

call npm run build production
aws s3 sync build/ s3://%1
GOTO End1

:No1
  ECHO Provide S3 Bucket name

:End1