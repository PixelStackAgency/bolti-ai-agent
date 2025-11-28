$VERCEL_TOKEN = "8eMfwPwG27jKwH12oHwQmA53"
$PROJECT_ID = "prj_DmWDLZWBKkUXkArrpQZgLXiLKfIs"
$BACKEND_URL = "https://bolti-ai-backend.onrender.com"

$headers = @{ "Authorization" = "Bearer $VERCEL_TOKEN"; "Content-Type" = "application/json" }
$body = @{ 
    key = "VITE_API_URL"
    value = $BACKEND_URL
    target = @("production", "preview", "development")
    type = "plain"
}

Write-Host "Setting VITE_API_URL in Vercel project $PROJECT_ID..."
try {
    $resp = Invoke-RestMethod -Method Post -Uri "https://api.vercel.com/v9/projects/$PROJECT_ID/env" `
        -Headers $headers -Body ($body | ConvertTo-Json)
    Write-Host "✓ Vercel env var set:" ($resp | ConvertTo-Json -Depth 2)
    
    Write-Host "Triggering Vercel redeploy..."
    $deployResp = Invoke-RestMethod -Method Post -Uri "https://api.vercel.com/v13/deployments?projectId=$PROJECT_ID" `
        -Headers $headers -Body (ConvertTo-Json @{ gitBranch = "main" })
    Write-Host "✓ Redeploy triggered"
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)"
}