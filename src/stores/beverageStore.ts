import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";

import { getCollection, createDocument, signInAuth, signOutAuth} from "../firebase.ts"
import type{User} from "firebase/auth"
import { WhereFilterOp } from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as User | null,
  }),

  actions: {
    async init() {
      var rawData = await getCollection("bases")

      if(rawData){
        this.bases = rawData.docs.map((doc) => doc.data() as BaseBeverageType)
      }

      this.currentBase = this.bases[0]

      console.log(this.bases)

      rawData = await getCollection("syrups")

      if(rawData){
        this.syrups = rawData.docs.map((doc) => doc.data() as SyrupType)
      }

      this.currentSyrup = this.syrups[0]

      console.log(this.syrups)

      rawData = await getCollection("creamers")

      if(rawData){
        this.creamers = rawData.docs.map((doc) => doc.data() as CreamerType)
      }

      this.currentCreamer = this.creamers[0]

      console.log(this.creamers)
      
    },
    async makeBeverage(name: string) {

      if(name){
      let temp = this.currentTemp
      let base = this.currentBase
      let syrup = this.currentSyrup
      let creamer = this.currentCreamer
      let recipe = {id: crypto.randomUUID().toString(), userID: this.user?.uid, name: name, temp: temp, base: base!, syrup: syrup!, creamer: creamer!}
      let dbRecipe = {...recipe, base: base!.id, syrup: syrup!.id, creamer: creamer!.id}
      await createDocument("beverages", dbRecipe.id, dbRecipe)

      let beverage = recipe as BeverageType
      this.beverages.push(beverage)
      }
    },

    showBeverage(name: string) {
      console.log(name)
      let beverage = this.beverages.find((bev) => bev.name === name)!
      if(beverage){
        this.currentBase = this.bases.find((base)=> base.id === beverage!.base.id)!
        this.currentCreamer = this.creamers.find((creamer) => creamer.id === beverage.creamer.id)!
        this.currentSyrup = this.syrups.find((syrup) => syrup.id === beverage.syrup.id)!
        this.currentTemp = this.temps.find((temp) => temp === beverage.temp)!
      }
    },

    async withGoogle(){
      let user = await signInAuth()
      if(user){
        this.setUser(user)

        let filter = {userID: {op: "==" as WhereFilterOp, value: user.uid}}

        let rawData = await getCollection("beverages", filter)

      console.log("beverages", rawData)

      if(rawData){
        this.beverages = rawData.docs.map((doc) => {
          const data = doc.data()

          return {
            id: doc.id,
            userID: data.userID,
            name: data.name,
            temp: data.temp,

            base: this.bases.find(base => base.id === data.base)!,
            syrup: this.syrups.find(syrup => syrup.id === data.syrup)!,
            creamer: this.creamers.find(creamer => creamer.id === data.creamer)!
          }
        })

      }
    }
  },

    setUser(user: User | null){
      this.user = user;
    },

    async signOut(){
      await signOutAuth()
      this.user = null;
      this.currentBase = this.bases[0]
      this.currentCreamer = this.creamers[0]
      this.currentSyrup = this.syrups[0]
      this.currentTemp = this.temps[0]
      this.currentBeverage = null;
    }
  },
});
