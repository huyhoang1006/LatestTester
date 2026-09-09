import transformerConditionMap from './Transformer/index'
import circuitBreakerConditionMap from './CircuitBreaker/index'
import disconnectorConditionMap from './Disconnector/index'
import currentTransformerConditionMap from './CurrentTransformer/index'
import powerCableConditionMap from './PowerCable/index'
import reactorConditionMap from './Reactor/index'
import rotatingMachineConditionMap from './RotatingMachine/index'
import capacitorConditionMap from './Capacitor/index'
import voltageTransformerConditionMap from './VoltageTransformer/index'
import surgeArresterConditionMap from './SurgeArrester/index'
import bushingConditionMap from './Bushing/index'

const testConditionMap = {
  Transformer: transformerConditionMap,
  CircuitBreaker: circuitBreakerConditionMap,
  Disconnector: disconnectorConditionMap,
  CurrentTransformer: currentTransformerConditionMap,
  PowerCable: powerCableConditionMap,
  Reactor: reactorConditionMap,
  RotatingMachine: rotatingMachineConditionMap,
  Capacitor: capacitorConditionMap,
  VoltageTransformer: voltageTransformerConditionMap,
  SurgeArrester: surgeArresterConditionMap,
  Bushing: bushingConditionMap
}

export default testConditionMap
