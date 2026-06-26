import { circuitBreakerJobPreload } from './circuitBreaker'
import { transformerJobPreload } from './transformer'
import { surgeArresterJobPreload } from './surgeArrester'
import { powerCableJobPreload } from './powerCable'
import { currentTransformerJobPreload } from './currentTransformer'
import { voltageTransformerJobPreload } from './voltageTransformer'
import { bushingJobPreload } from './bushing'
import { disconnectorJobPreload } from './disconnector'
import { rotatingMachineJobPreload } from './rotatingMachine'
import { capacitorJobPreload } from './capacitor'
import { reactorJobPreload } from './reactor'

export const jobEntityPreload = {
    circuitBreakerJob: circuitBreakerJobPreload,
    transformerJob: transformerJobPreload,
    surgeArresterJob: surgeArresterJobPreload,
    powerCableJob: powerCableJobPreload,
    currentTransformerJob: currentTransformerJobPreload,
    voltageTransformerJob: voltageTransformerJobPreload,
    bushingJob: bushingJobPreload,
    disconnectorJob: disconnectorJobPreload,
    rotatingMachineJob: rotatingMachineJobPreload,
    capacitorJob: capacitorJobPreload,
    reactorJob: reactorJobPreload
}