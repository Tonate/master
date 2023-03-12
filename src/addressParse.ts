import { Address } from "ton-core";

function addressParse(address : string){
    console.log(Address.parse(address));
    
}
addressParse("0:947721e887a5921dc774da8202a5bcf9499c59bff220fe706941c79b93e3a67f");