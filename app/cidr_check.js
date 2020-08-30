const os = require('os');
const nets = os.networkInterfaces();

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
for(var name in nets){
  for(var i in nets[name]){
    var net = nets[name][i];
    if(net.family != 'IPv4' || name.indexOf('Loopback') != -1) continue;

    console.log(net);
    //var bool = checkipincidr(net.address, net.cidr.split('/')[0], net.netmask);
    var bool = checkipincidr('192.168.1.117', net.cidr.split('/')[0], net.netmask);
    console.log(bool);
  }
}

//-----------------------------------------------
//-----------------------------------------------
//-----------------------------------------------
function checkipincidr(check, cidr, mask){
  check = leadingzeros(ip2binary(check), 32);
  cidr = leadingzeros(ip2binary(cidr), 32);
  mask = leadingzeros(ip2binary(mask), 32);

  for(var i = 0; i < mask.length; i++){
    if(mask[i] == 0) break;
    if(check[i] == cidr[i]) continue;
    return false;
  }
  return true;
}
