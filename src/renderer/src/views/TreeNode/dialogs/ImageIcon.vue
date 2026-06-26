<template>
  <img :src="iconSrc" :style="{ width: size || '40px', height: size || '40px' }" class="treeview-icon" />
</template>

<script>
import substationIcon from '@/assets/Treeview/Substation.png';
import voltageLevelIcon from '@/assets/Treeview/Voltage Level.png';
import bayIcon from '@/assets/Treeview/Bay.png';
import disconnectorIcon from '@/assets/Treeview/Disconnector.png';
import currentTransformerIcon from '@/assets/Treeview/Current Transformer.png';
import capacitorIcon from '@/assets/Treeview/Capacitor.png';
import reactorIcon from '@/assets/Treeview/Reactor.png';
import powerCableIcon from '@/assets/Treeview/power cable.png';
import surgeArresterIcon from '@/assets/Treeview/Surge arrester.png';
import transformer2WIcon from '@/assets/Treeview/2W Tranformer 2.png';
import transformer3WIcon from '@/assets/Treeview/3W Transformer 2.png';
import transformerAutoIcon from '@/assets/Treeview/Auto Transformer.png';

export default {
  name: 'ImageIcon',
  props: {
    iconName: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '40px'
    }
  },
  computed: {
    iconSrc() {
      const map = {
        'Substation': substationIcon,
        'VoltageLevel': voltageLevelIcon,
        'Bay': bayIcon,
        'Disconnector': disconnectorIcon,
        'CurrentTransformer': currentTransformerIcon,
        'Capacitor': capacitorIcon,
        'Reactor': reactorIcon,
        'PowerCable': powerCableIcon,
        'SurgeArrester': surgeArresterIcon,
        'Transformer-2W': transformer2WIcon,
        'Transformer-3W': transformer3WIcon,
        'Transformer-Auto': transformerAutoIcon,
        'Transformer': transformer2WIcon
      };
      return map[this.iconName] || map['PowerCable'];
    }
  }
}
</script>

<style scoped>
.treeview-icon {
  object-fit: contain;
  display: inline-block;
  padding: 2px; 
}
</style>