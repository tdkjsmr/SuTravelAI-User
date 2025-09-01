<template>
    <div style="height: 4px;"></div>
    <div class="result-item" v-for="(item,index) in functionData" :key="index">
        <div>
            <p class="query-time">{{ item.departuretime }}</p>
            <p class="station-name">{{ item.station }}</p>
        </div>
        <div class="train-run-number">
            <p>{{ item.costtime }}</p>
            <p>{{ item.trainno }}</p>
        </div>
        <div>
            <p class="query-time">{{ item.arrivaltime }}</p>
            <p class="station-name">{{ item.endstation }}</p>
        </div>
        <div class="tickets-price">
            <p v-if="item.priceed != '-'">￥{{ item.priceed }}</p>
            <p v-if="item.priceyz != '-'">￥{{ item.priceyz }}</p>
        </div>
    </div>
    <div style="height: 4px;"></div>
</template>

<script setup lang="ts">
import { serverTrainTicketsType } from "@/types/index";
defineProps<{
    functionData:serverTrainTicketsType
}>()
</script>

<style scoped lang="less">
.result-item{
    display: flex;
    align-items: center;
    background-color: #ffffff;
    justify-content: space-around;
    padding: 7px 0;
    border-top: 1px solid #f6f8fa;
    .query-time{
        font-weight: bold;
        font-size: 17px;
    }
    .station-name{
        font-weight: bold;
        font-size: 14px;
    }
    .train-run-number{
        p{
            font-size: 13px;
            color:#666697;
        }
    }
    .tickets-price{
        font-size: 17px;
        font-weight: bold;
        color: #006ff6;
    }
}
</style>