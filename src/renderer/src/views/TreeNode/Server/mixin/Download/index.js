import { processOrganisationDownload } from './organisation'
import { processSubstationDownload } from './substation'
import { processVoltageLevelDownload } from './voltageLevel'
import { processBayDownload } from './bay'
import { processAssetDownload } from './asset'
import { downloadTransformerChain } from './transformer'
import { downloadCircuitBreakerChain } from './circuitBreaker'
import { downloadCurrentTransformerChain } from './currentTransformer'
import { downloadDisconnectorChain } from './disconnector'
import { downloadSurgeArresterChain } from './surgeArrester'
import { downloadVoltageTransformerChain } from './voltageTransformer'
import { useLoadingStore } from '@/store/loading'

const assetChainDownloaders = {
    'Transformer':         downloadTransformerChain,
    'Circuit breaker':     downloadCircuitBreakerChain,
    'Current transformer': downloadCurrentTransformerChain,
    'Disconnector':        downloadDisconnectorChain,
    'Surge arrester':      downloadSurgeArresterChain,
    'Voltage transformer': downloadVoltageTransformerChain,
}

export async function executeDownload(node, ctx) {
    const loadingStore = useLoadingStore()
    loadingStore.start('Downloading...', true)

    try {
        const assetDownloader = assetChainDownloaders[node.asset]
        if (assetDownloader) {
            await assetDownloader(node, ctx)
        } else {
            const strategies = {
                'organisation': processOrganisationDownload,
                'substation':   processSubstationDownload,
                'voltageLevel': processVoltageLevelDownload,
                'bay':          processBayDownload,
            }
            const handler = strategies[node.mode]
            if (handler) {
                await handler(node, ctx)
            } else {
                await processAssetDownload(node, ctx)
            }
        }

        await ctx.showLocationRoot()
        ctx.$message.success(`${node.aliasName || 'Data'} downloaded successfully!`)

    } catch (error) {
        if (error.message !== 'CANCELED') {
            console.error('[Download Framework Error]:', error)
            ctx.$message.error('error in download: ' + error.message)
        }
    } finally {
        loadingStore.stop()
    }
}
