const {toHex,utf8ToHex,toBN, hexToUtf8} = require("web3-utils");
import {BaseContract,BaseContractType} from "@zap/basecontract";
import {Curve,CurveType} from "@zap/curve";
import {DEFAULT_GAS} from "@zap/utils"
import {InitProvider, InitCurve, NextEndpoint, EndpointParams} from "./types"

export class ZapRegistry extends BaseContract {
    contract:any;
    constructor({artifactsDir=undefined,networkId=undefined,networkProvider=undefined}:BaseContractType){
        super({artifactsDir,artifactName:"Registry",networkId,networkProvider});
    }

    async initiateProvider({public_key, title, endpoint, endpoint_params, from, gas=DEFAULT_GAS}:InitProvider) {
        try {
            let params = endpoint_params? endpoint_params.map((item:string) =>{return utf8ToHex(item)}) : [];
            return await this.contract.methods.initiateProvider(
                toBN(public_key),
                utf8ToHex(title),
                utf8ToHex(endpoint),
                params)
                .send({from,gas});
        } catch (err) {
            throw err;
        }
    }

    async initiateProviderCurve({endpoint, curve, from, gas=DEFAULT_GAS}:InitCurve) {
        try {
            let convertedConstants = curve.constants.map((item:number) => {
                return toHex(item);
            });
            let convertedParts = curve.parts.map((item:number)=> {
                return toHex(item);
            });
            let convertedDividers = curve.dividers.map((item:number) => {
                return toHex(item);
            });
            return await this.contract.methods.initiateProviderCurve(
                utf8ToHex(endpoint),
                convertedConstants,
                convertedParts,
                convertedDividers)
                .send({from, gas});
        } catch (err) {
            throw err;
        }
    }

    async setEndpointParams({endpoint, endpoint_params, from, gas=DEFAULT_GAS}:EndpointParams) {
        try {
          let params = endpoint_params ? endpoint_params.map(el =>{return utf8ToHex(el)}) : [];
            return await this.contract.methods.setEndpointParams(
                utf8ToHex(endpoint),
                params).send({from, gas});
        } catch (err) {
            throw err;
        }
    }

    async getProviderPublicKey(provider:string):Promise<number>{
        let pubKey:string =  await this.contract.methods.getProviderPublicKey(provider).call();
        return Number(pubKey.valueOf());
    }

    async getProviderTitle(provider:string):Promise<string>{
        let title = await this.contract.methods.getProviderTitle(provider).call();
        return hexToUtf8(title)
    }

    /**
     *
     * @param {string} provider
     * @param {string} endpoint
     * @returns {Promise<Curve>}
     */
    async getProviderCurve(provider:string,endpoint:string):Promise<CurveType>{
        let curve =  await this.contract.methods.getProviderCurve(
            provider,
            utf8ToHex(endpoint)
        ).call();
        return new Curve(curve['0'].map((i:string)=>parseInt(i)),curve['1'].map((i:string)=>parseInt(i)),curve['2'].map((i:string)=>parseInt(i)))
    }

    /**
     *
     * @param index
     * @returns {Promise<any>}
     */
    async getNextProvider(index:number){
        return await this.contract.methods.getNextProvider(index).call();
    }

    /**
     *
     * @param provider
     * @param endpoint
     * @param index
     * @returns {Promise<any>}
     */
    async getNextEndpointParams({provider, endpoint, index}:NextEndpoint){
        let params = await  this.contract.methods.getNextEndpointParam(
            provider,
            utf8ToHex(endpoint),
            toBN(index)
        ).call();
        let endpointParams = params.endpointParam;
        console.log(hexToUtf8(endpointParams));
        return hexToUtf8(endpointParams)
    }

    // ==== Events ====//

    async listen(filters:object={}, callback:Function){
        this.contract.events.allEvents(filters, callback);
    }

    async listenNewProvider(filters:object={}, callback:Function){
        this.contract.events.NewProvider(filters, callback);
    }

    async listenNewCurve({provider}:{provider:string}, callback:Function){
        this.contract.events.NewCurve(provider, callback);
    }

}

export * from "./types" ;
