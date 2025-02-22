<script setup lang="ts">
import UserInfoCom from '@/components/UserInfoCom.vue'
</script>
<template>
    <div class="test-page">
        <UserInfoCom></UserInfoCom>
        <div class="father">
            <div class="son">
                <div class="son-item">
                    123
            </div>
        </div>
            <div class="son2">2</div>
        </div>
        <div class="father">
            <div class="son"><div class="son-item">
                    123
            </div></div>
            <div class="son2">2</div>
        </div>
        <div class="father">
            <div class="son"><div class="son-item">
                    123
            </div></div>
            <div class="son2">2</div>
        </div>
        
        <!-- <div class="father">
            <div class="son">1</div>
            <div class="son">2</div>
        </div> -->
        <!-- <div class="father">
            <div class="son">1</div>
            <div class="son">2</div>
        </div> -->
    </div>
</template>

<style scoped lang="scss">
.test-page{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    overflow: hidden auto;
    // height: 100vh;
    .father{
        flex: 1 1 0;
        display: flex;
    // cursor: pointer;
    // flex-direction: column;
    // overflow: hidden auto;
        .son,.son2{
            // flex: 1;
            background-color: pink;
        }
        .son-item{
            width: 200px;
            height: 260px;;
        }
        
    }
    @media (max-width: 768px) {
      .father{
        flex-direction: column;
      }

  }
}
</style>