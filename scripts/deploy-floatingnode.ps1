# Automated FloatingNode SFTP Deployer
param(
    [Parameter(Mandatory=$false)]
    [string]$Password = ""
)

$HostName = "free-ca.floatingnode.bond"
$Port = 2022
$User = "udbwcw4p.5b9d2890"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  FloatingNode SFTP Deployment Pipeline   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Target Host: $HostName`:$Port" -ForegroundColor Yellow
Write-Host "Username   : $User" -ForegroundColor Yellow

# Test Connectivity
$test = Test-NetConnection -ComputerName $HostName -Port $Port -WarningAction SilentlyContinue
if ($test.TcpTestSucceeded) {
    Write-Host "✅ Network connection to SFTP port 2022 is OPEN." -ForegroundColor Green
} else {
    Write-Host "❌ Could not reach $HostName on port $Port." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "To connect via terminal OpenSSH SFTP:" -ForegroundColor Yellow
Write-Host "sftp -P $Port $User@$HostName" -ForegroundColor White
Write-Host ""
Write-Host "Or via FileZilla / WinSCP:" -ForegroundColor Yellow
Write-Host "Host: sftp://$HostName" -ForegroundColor White
Write-Host "Port: $Port" -ForegroundColor White
Write-Host "User: $User" -ForegroundColor White
Write-Host "Pass: [Your FloatingNode panel account password]" -ForegroundColor White
