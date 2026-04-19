<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <input v-model="name" type="text" placeholder="Beverage Name" />
    <button @click="makeBeverage">🍺 Make Beverage</button>
  </div>
  <div v-if="beverageStore.user != null" class="loggedIn">
    <p >Welcome back {{ beverageStore.user.displayName }}!</p>
  <div id="beverage-container" style="margin-top: 20px">
    <ul>
      <li>
        <template v-for="b in beverageStore.beverages" :key="b.id">
            <label>
              <input
                type="radio"
                name="beverages"
                :id="`r${b.id}`"
                :value="b"
                v-model="beverageStore.currentBeverage"
                @change = "onSelectedChange">{{ b.name }}</label>
        </template>   
      </li>
    </ul>
  </div>
      <button @click="logout">Sign Out</button>
  </div>
  <div v-else class="loggedOut">
    <button @click="login">Sign In</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const name = ref("")

const beverageStore = useBeverageStore();

const makeBeverage = () => {
  beverageStore.makeBeverage(name.value)
}

const onSelectedChange = () => {
  beverageStore.showBeverage(beverageStore.currentBeverage!.name)
}

const login = () => {
  beverageStore.withGoogle()
}

const logout = () => {
  beverageStore.signOut()
}

</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}

ul {
  list-style: none;
}

.loggedIn {
  text-align: center;
}

#beverage-container li{
  display: flex;
  justify-content: space-around;
}

.loggedOut{
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
