<template>
    <div class="explorer">
        <div v-show="clientSlide" class="toolbar">
            <TopBarClient :pathMapClient.sync="pathMapClient" :organisationClientList="organisationClientList"
                @clear-selection="clearSelection" />
        </div>
        <div v-show="!clientSlide" class="toolbar">
            <TopBarServer :pathMapServer="pathMapServer" @reset-all="resetAllServer" @path-click="resetPathServer" />
        </div>
        <!-- Tree Toolbar -->
        <TreeToolbar :clientSlide="clientSlide" @add-command="handleAddCommand"
            @dropdown-visible-change="handleDropdownVisibleChange" @asset-command="handleAssetCommand"
            @open-import-dialog="handleOpenImportDialog" @export-command="handleCommand" @open-node="handleOpenNode"
            @duplicate="duplicateSelectedNodes" @upload="handleUploadNode" @download="handleDownloadNode"
            @delete="handleDeleteNode" @fmeca="handleClickFmeca" @move="handleMoveNode" />
        <!-- Thanh điều hướng có thể kéo rộng/kéo hẹp -->
        <div class="resizable-sidebar">
            <ClientTreePanel ref="clientPanel" v-show="clientSlide" :organisationClientList="organisationClientList"
                :selectedNodes.sync="selectedNodes" @showLocationRoot="showLocationRoot" @show-addSubs="showAddSubs"
                @double-click-node="doubleClickNode" @fetch-children="fetchChildren"
                @show-properties="showPropertiesDataClient" @update-selection="updateSelection"
                @clear-selection="clearSelection" @delete-data="handleDeleteFromContextMenu"
                @show-addSubsInTree="showAddSubsInTree" @show-addOrganisation="showAddOrganisation"
                @show-addVoltageLevel="showAddVoltageLevel" @show-addTransformer="showAddTransformer"
                @show-addJob="showAddJob" @show-addBushing="showAddBushing"
                @show-addSurgeArrester="showAddSurgeArrester" @show-addCircuit="showAddCircuitBreaker"
                @show-addVt="showAddVt" @show-addCt="showAddCt" @show-addPowerCable="showAddPowerCable"
                @show-addDisconnector="showAddDisconnector" @show-addCapacitor="showAddCapacitor"
                @show-addReactor="showAddReactor" @show-addRotatingMachine="showAddRotatingMachine"
                @show-addBay="showAddBay" @export-json="handleExportJSONFromContext"
                @export-json-cim="handleExportJSONCIMFromContext" @export-xml="handleExportXMLFromContext"
                @export-excel="handleExportExcelFromContext" @export-word="handleExportWordFromContext"
                @export-pdf="handleExportPDFFromContext" @duplicate-node="handleDuplicateFromContext"
                @move-node="handleMoveFromContext" @import-json="handleImportJSONFromContext"
                @show-zero-diagram="handleShowZeroDiagram" @import-json-cim="handleImportJSONCIMFromContext"
                @show-data="showDataClient" @refresh-node="handleRefreshNode" />

            <ServerTreePanel ref="serverPanel" v-show="!clientSlide" :ownerServerList="ownerServerList"
                :selectedNodes.sync="selectedNodes" @showOwnerServerRoot="showOwnerServerRoot"
                @fetch-children-server="fetchChildrenServer" @double-click-node-server="doubleClickNodeServer"
                @show-properties="showPropertiesData" @update-selection="updateSelection"
                @clear-selection="clearSelection" @show-data="showData" @export-json="handleExportJSONFromContext"
                @export-json-cim="handleExportJSONCIMFromContext" @export-xml="handleExportXMLFromContext"
                @export-excel="handleExportExcelFromContext" @export-word="handleExportWordFromContext"
                @export-pdf="handleExportPDFFromContext" @duplicate-node="handleDuplicateFromContext"
                @move-node="handleMoveFromContext" @import-json="handleImportJSONFromContext"
                @show-zero-diagram="handleShowZeroDiagram" @import-json-cim="handleImportJSONCIMFromContext"
                @refresh-node="handleRefreshNode" />

            <div @mousedown="startResizeClient" v-if="clientSlide" ref="resizerClient" class="resizer"></div>
            <div @mousedown="startResizeServer" v-if="!clientSlide" ref="resizerServer" class="resizer"></div>
            <div ref="contextDataServer" v-show="!clientSlide" class="context-data">
                <div ref="contentData" class="content-data">
                    <div ref="content" class="content">
                        <div class="title-content"></div>
                        <div class="content-content">
                            <Tabs :side="'server'" ref="serverTabs" v-model="activeTab" :tabs="tabs"
                                @close-tab="removeTab" />
                        </div>
                    </div>
                    <div @mousedown="startResizeContentServer" ref="resizerContentServer" class="resizer"></div>
                    <div v-if="propertiesSign" ref="properties" class="properties">
                        <div class="title-properties">
                            <div class="title-wrapper">
                                <div class="title-name">Object Properties</div>
                                <div style="margin-right: 5px">
                                    <i @click="hideProperties" class="fa-solid fa-square-caret-right"></i>
                                </div>
                            </div>
                        </div>
                        <div class="content-properties">
                            <div class="content-properties-header">
                                <i class="fa-solid fa-chevron-down" style="padding-right: 5px; font-size: 10px"></i>
                                Owner & Position
                            </div>
                            <div class="content-properties-table">
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Name</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.name }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Region</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.region }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Plant</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.plant }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Address</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.address }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">City</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.city }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">State/Province</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.state_province }}</div>
                                </div>

                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Country</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.country }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Geo coordinates</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word"></div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Phone number</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.phone_no }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Email</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        properties.email }}</div>
                                </div>
                            </div>
                            <div v-if="assetPropertySign" class="content-properties-header">
                                <i class="fa-solid fa-chevron-down" style="padding-right: 5px; font-size: 10px"></i>
                                Asset Properties
                            </div>
                            <div v-if="assetPropertySign" class="content-properties-table">
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Asset</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.asset }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Asset type</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.asset_type }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Serial number</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.serial_no }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Manufacturer</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.manufacturer }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Manufacturer type</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.manufacturer_type }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Manufacturing year</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.manufacturing_year }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Country</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.country }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Apparatus id</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        assetProperties.apparatus_id }}</div>
                                </div>
                            </div>
                            <div v-if="jobPropertySign" class="content-properties-header">
                                <i class="fa-solid fa-chevron-down" style="padding-right: 5px; font-size: 10px"></i>
                                Job Properties
                            </div>
                            <div v-if="jobPropertySign" class="content-properties-table">
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Name</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.name }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Work order</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.work_order }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Creation date</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.creation_date }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Execution date</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.execution_date }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Tested by</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.tested_by }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Approved by</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.approved_by }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Ambient condition</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.ambient_condition }}</div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Standard</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word">{{
                                        jobProperties.standard }}</div>
                                </div>
                            </div>
                            <div class="content-properties-header">
                                <i class="fa-solid fa-chevron-down" style="padding-right: 5px; font-size: 10px"></i>
                                Configuration Version
                            </div>
                            <div class="content-properties-table">
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Last Modified</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word"></div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Author</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word"></div>
                                </div>
                                <div class="content-properties-table-flex">
                                    <div class="content-properties-table-header">Last Saved By</div>
                                    <div class="content-properties-table-content fixed-box pl10 break-word"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!propertiesSign" @click="showProperties" class="trapezoid"></div>
                </div>
                <div ref="logBar" v-if="logSign" class="log-bar">
                    <LogBar :logData="logDataServer" @hideLogBar="hideLogBar"></LogBar>
                </div>
            </div>
            <ContextDataClient v-show="clientSlide" ref="contextDataClient" :activeTabClient="activeTabClient"
                :tabsClient="tabsClient" :propertiesSignClient.sync="propertiesSignClient"
                :propertiesClient="propertiesClient" :assetPropertySignClient="assetPropertySignClient"
                :assetPropertiesClient="assetPropertiesClient" :jobPropertySignClient="jobPropertySignClient"
                :jobPropertiesClient="jobPropertiesClient" :logSignClient.sync="logSignClient"
                :logDataClient="logDataClient" @update:activeTabClient="activeTabClient = $event"
                @tab-changed="handleTabSelect" @remove-tab-client="removeTabClient"
                @update-node-data="handleUpdateNodeData" @refresh-properties="handleRefreshPropertiesClient"
                @reload-log-client="reloadLogClient" />
        </div>

        <!-- Dialog Components -->
        <SubstationDialog ref="substationDialog" :visible="signSubs" @update:visible="signSubs = $event"
            :parentOrganization="parentOrganization" :personList="personList" :locationList="locationList"
            :organisationId="organisationId" :isSaving="isSaving" @close="handleSubsCancel" @cancel="handleSubsCancel"
            @confirm="handleSubsConfirm" />

        <OrganisationDialog ref="organisationDialog" :visible="signOrg"
            @update:visible="signOrg = $event"
            :parentOrganization="parentOrganization" :isSaving="isSaving" @close="handleOrgCancel" @cancel="handleOrgCancel"
            @confirm="handleOrgConfirm" />

        <VoltageLevelDialog ref="voltageLevelDialog" :visible="signVoltageLevel"
            @update:visible="signVoltageLevel = $event" :locationId="locationId"
            :parentOrganization="parentOrganization" :isSaving="isSaving" @close="handleVoltageLevelCancel"
            @cancel="handleVoltageLevelCancel" @confirm="handleVoltageLevelConfirm" />

        <BayDialog ref="bayDialog" :visible="signBay" @update:visible="signBay = $event" :locationId="locationId"
            :parentOrganization="parentOrganization" :isSaving="isSaving" @close="handleBayCancel" @cancel="handleBayCancel"
            @confirm="handleBayConfirm" />

        <TransformerDialog ref="transformerDialog" :visible="signTransformer" @update:visible="signTransformer = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleTransformerCancel" @cancel="handleTransformerCancel" @confirm="handleTransformerConfirm" />

        <BushingDialog ref="bushingDialog" :visible="signBushing" @update:visible="signBushing = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleBushingCancel" @cancel="handleBushingCancel" @confirm="handleBushingConfirm" />

        <SurgeArresterDialog ref="surgeArresterDialog" :visible="signSurge" @update:visible="signSurge = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleSurgeCancel" @cancel="handleSurgeCancel" @confirm="handleSurgeConfirm" />

        <CircuitBreakerDialog ref="circuitBreakerDialog" :visible="signCircuit" @update:visible="signCircuit = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleCircuitCancel" @cancel="handleCircuitCancel" @confirm="handleCircuitConfirm" />

        <CurrentTransformerDialog ref="currentTransformerDialog" :visible="signCt" @update:visible="signCt = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleCtCancel" @cancel="handleCtCancel" @confirm="handleCtConfirm" />

        <VoltageTransformerDialog ref="voltageTransformerDialog" :visible="signVt" @update:visible="signVt = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleVtCancel" @cancel="handleVtCancel" @confirm="handleVtConfirm" />

        <PowerCableDialog ref="powerCableDialog" :visible="signPower" @update:visible="signPower = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handlePowerCancel" @cancel="handlePowerCancel" @confirm="handlePowerConfirm" />

        <DisconnectorDialog ref="disconnectorDialog" :visible="signDisconnector"
            @update:visible="signDisconnector = $event" :locationId="locationId"
            :parentOrganization="parentOrganization" :modal="!isDuplicating" :show-close="!isDuplicating"
            :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleDisconnectorCancel" @cancel="handleDisconnectorCancel" @confirm="handleDisconnectorConfirm" />

        <RotatingMachineDialog ref="rotatingMachineDialog" :visible="signRotating"
            @update:visible="signRotating = $event" :locationId="locationId" :parentOrganization="parentOrganization"
            :modal="!isDuplicating" :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'"
            :custom-class="dialogClass" :isSaving="isSaving" @close="handleRotatingCancel" @cancel="handleRotatingCancel"
            @confirm="handleRotatingConfirm" />

        <CapacitorDialog ref="capacitorDialog" :visible="signCapacitor" @update:visible="signCapacitor = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleCapacitorCancel" @cancel="handleCapacitorCancel" @confirm="handleCapacitorConfirm" />

        <ReactorDialog ref="reactorDialog" :visible="signReactor" @update:visible="signReactor = $event"
            :locationId="locationId" :parentOrganization="parentOrganization" :modal="!isDuplicating"
            :show-close="!isDuplicating" :transition="isDuplicating ? '' : 'dialog-fade'" :custom-class="dialogClass"
            :isSaving="isSaving" @close="handleReactorCancel" @cancel="handleReactorCancel" @confirm="handleReactorConfirm" />

        <JobDialog ref="jobDialog" :visible="signJob" @update:visible="signJob = $event" :checkJobType="checkJobType"
            :locationData="locationData" :assetData="assetData" :productAssetModelData="productAssetModelData"
            :parentOrganization="parentOrganization" :testTypeListData="testTypeListData" :isSaving="isSaving" @close="handleJobCancel"
            @cancel="handleJobCancel" @confirm="handleJobConfirm" />

        <ExportDialog :visible="openExportDialog" @update:visible="openExportDialog = $event" :exportType="exportType"
            @cancel="handleCancelExport" @confirm="handleExportConfirm" />

        <ImportDialog :visible="openImportDialog" @update:visible="openImportDialog = $event"
            @cancel="handleCancelImport" @confirm="handleImportConfirm" />

        <FmecaDialog :visible="signFmeca" @update:visible="signFmeca = $event" @close="handleFmecaCancel"
            @cancel="handleFmecaCancel" @confirm="handleFmecaConfirm" />

        <MoveDialog :visible="moveDialogVisible" @update:visible="moveDialogVisible = $event"
            :moveTreeData="moveTreeData" :selectedTargetNodes="selectedTargetNodes"
            :selectedTargetNode="selectedTargetNode" :nodeToMove="nodeToMove" :moveDisplayText="moveDisplayText"
            :moveDisplayData="moveDisplayData" @close="handleMoveCancel" @cancel="handleMoveCancel"
            @confirm="confirmMoveNode" @fetch-children="fetchChildrenForMove"
            @update-selection="handleMoveNodeSelection" />

        <DownloadDialog :visible="downloadDialogVisible" @update:visible="downloadDialogVisible = $event"
            :moveTreeData="moveTreeData" :moveTreeProps="moveTreeProps" :expandedMoveKeys="expandedMoveKeys"
            :selectedDownloadTargetNode="selectedDownloadTargetNode" @close="() => downloadDialogVisible = false"
            @cancel="() => downloadDialogVisible = false" @confirm="confirmDownloadSelection"
            @node-click="handleDownloadTargetSelection" @node-expand="fetchChildren" />

        <ZeroDiagramDialog ref="zeroDiagramDialog" :visible="signZeroDiagram" @update:visible="signZeroDiagram = $event"
            :currentNode="nodeForZeroDiagram" :isServer="!clientSlide" @close="handleZeroDiagramClose" :checkChildrenMethod="checkChildren" @node-deleted="handleNodeDeletedFromDiagram"
            @delete-node="handleDeleteNodeFromDiagram" @edit-node="handleEditNodeFromDiagram" />
    </div>
</template>
<script>
/* eslint-disable */
import LogBar from '@/components/LogBar/index.vue'
import TreeNode from '@/views/Common/TreeNode.vue'
import pageAlign from '@/views/PageAlign/pageAlign.vue'
import spinner from '@/views/Common/Spinner.vue'
import Tabs from '@/views/Common/Tabs.vue'
import contextMenu from '@/views/Common/ContextMenu.vue'
import TreeToolbar from './components/TreeToolbar.vue'
import { startLoading, stopLoading } from '@/utils/loading'

//client
import TopBarClient from './Client/Topbar/index.vue'
import ContextDataClient from './Client/ClientContext/ContextData.vue'

// Import Mappers
import mapClientProperties from '@/utils/MapperClient/mapClientProperties'
import mapClientAssetProperties from '@/utils/MapperClient/mapClientAssetProperties'
import mapClientJobProperties from '@/utils/MapperClient/mapClientJobProperties'
import mapProperties from '@/utils/MapperServer/mapProperties'
import mapAssetProperties from '@/utils/MapperServer/mapAssetProperties'
import mapJobProperties from '@/utils/MapperServer/mapJobProperties'

// Import Components
import Substation from '../LocationInsert/locationLevelView.vue'
import Organisation from '@/views/Organisation/index.vue'
import VoltageLevel from '@/views/VoltageLevel/index.vue'
import Bay from '@/views/Bay/index.vue'
import Transformer from '@/views/AssetView/Transformer/index.vue'
import Bushing from '@/views/AssetView/Bushing/index.vue'
import SurgeArrester from '@/views/AssetView/SurgeArrester/index.vue'
import CircuitBreaker from '@/views/AssetView/CircuitBreaker/index.vue'
import CurrentTransformer from '@/views/AssetView/CurrentTransformer/index.vue'
import Disconnector from '@/views/AssetView/Disconnector/index.vue'
import PowerCable from '@/views/AssetView/PowerCable/index.vue'
import VoltageTransformer from '@/views/AssetView/VoltageTransformer/index.vue'
import Capacitor from '@/views/AssetView/Capacitor/index.vue'
import Reactor from '@/views/AssetView/Reactor/index.vue'
import RotatingMachine from '@/views/AssetView/RotatingMachine/index.vue'

// Import Jobs
import JobSurgeArrester from '@/views/JobView/SurgeArrester/index.vue'
import JobPowerCable from '@/views/JobView/PowerCable/index.vue'
import JobDisconnector from '@/views/JobView/Disconnector/index.vue'
import JobCurrentTransformer from '@/views/JobView/CurrentTransformer/index.vue'
import JobVoltageTransformer from '@/views/JobView/VoltageTransformer/index.vue'
import JobCircuitBreaker from '@/views/JobView/CircuitBreaker/index.vue'
import JobTransformer from '@/views/JobView/Transformer/index.vue'

import mixin from './Common'
import Attachment from '../Common/Attachment.vue'
import Icon from '@/views/Common/Icon.vue'
import Fmeca from '@/views/Fmeca/index.vue'
import Export from '@/views/Export/index.vue'

// Import Dialog Components
import {
    SubstationDialog,
    OrganisationDialog,
    VoltageLevelDialog,
    BayDialog,
    TransformerDialog,
    BushingDialog,
    SurgeArresterDialog,
    CircuitBreakerDialog,
    CurrentTransformerDialog,
    VoltageTransformerDialog,
    PowerCableDialog,
    DisconnectorDialog,
    RotatingMachineDialog,
    CapacitorDialog,
    ReactorDialog,
    JobDialog,
    ExportDialog,
    ImportDialog,
    FmecaDialog,
    MoveDialog,
    DownloadDialog,
    ZeroDiagramDialog
} from './dialogs'


import mixinTreeNavigation from '@/views/TreeNode/Common/mixinTreeNavigation/mixin'
import TopBarServer from './Server/TopBarServer/index.vue'
import uploadNodeMixin from './mixin/Upload/index.js';
import downloadNode from './Server/mixin/Download/downloadNode.js';
import ClientTreePanel from './Client/ClientTree/index.vue'
import ServerTreePanel from './Server/ServerTree/index.vue'
export default {
    name: 'TreeNavigation',
    components: {
        TreeToolbar,
        ContextDataClient,
        ServerTreePanel,
        ClientTreePanel,
        mapJobProperties,
        mapAssetProperties,
        mapProperties, mapClientProperties,
        mapClientJobProperties,
        mapClientAssetProperties,
        TopBarServer,
        TopBarClient,
        LogBar,
        TreeNode,
        pageAlign,
        spinner,
        contextMenu,
        Tabs,
        Substation,
        Organisation,
        VoltageLevel,
        Bay,
        Transformer,
        Bushing,
        SurgeArrester,
        CircuitBreaker,
        CurrentTransformer,
        VoltageTransformer,
        Disconnector,
        PowerCable,
        RotatingMachine,
        Capacitor,
        Reactor,
        JobSurgeArrester,
        JobPowerCable,
        JobDisconnector,
        JobCurrentTransformer,
        JobVoltageTransformer,
        JobCircuitBreaker,
        JobTransformer,
        Icon,
        Fmeca,
        Export,
        // Dialog Components
        SubstationDialog,
        OrganisationDialog,
        VoltageLevelDialog,
        BayDialog,
        TransformerDialog,
        BushingDialog,
        SurgeArresterDialog,
        CircuitBreakerDialog,
        CurrentTransformerDialog,
        VoltageTransformerDialog,
        PowerCableDialog,
        DisconnectorDialog,
        RotatingMachineDialog,
        CapacitorDialog,
        ReactorDialog,
        JobDialog,
        ExportDialog,
        ImportDialog,
        FmecaDialog,
        MoveDialog,
        DownloadDialog,
        ZeroDiagramDialog
    },
    data() {
        return {
            exportType: null,
            openExportDialog: false,
            openImportDialog: false,
            signFmeca: false,
            parentOrganization: null,
            logDataServer: [],
            logDataClient: [],
            organisationId: '0000000-0000-0000-0000-000000000000',
            locationId: '',
            locationData: {},
            assetData: {},
            productAssetModelData: {},
            checkJobType: '',
            testTypeListData: [],
            organisationClientList: [],
            signSubs: false,
            signOrg: false,
            signVoltageLevel: false,
            signBay: false,
            signTransformer: false,
            signBushing: false,
            signSurge: false,
            signCircuit: false,
            signCt: false,
            signVt: false,
            signPower: false,
            signDisconnector: false,
            signRotating: false,
            signJob: false,
            signCapacitor: false,
            signReactor: false,
            activeTab: {},
            activeTabClient: {},
            indexTabData: null,
            tabs: [],
            tabsClient: [],
            rightClickNode: null,
            selectedNodes: [],
            assetPropertySign: false,
            jobPropertySign: false,
            assetPropertySignClient: false,
            jobPropertySignClient: false,
            pathMapServer: [],
            pathMapClient: [],
            hideTabContentServer: [],
            hideTabContentClient: [],
            currentTabServer: '',
            isDuplicating: false,
            moveDialogVisible: false,
            moveTreeData: [],
            selectedTargetNode: null,
            selectedTargetNodes: [], // Dùng cho hiển thị highlight trong tree dialog
            expandedMoveKeys: [],
            nodeToMove: null, // Lưu node đang được move để dùng trong fetchChildrenForMove
            validParentTypesForMove: [],
            downloadDialogVisible: false,
            nodeToDownloadData: null, // Lưu dữ liệu DTO từ server về
            selectedDownloadTargetNode: null, // Node cha được chọn thủ công
            selectedDownloadTargetNodes: [], // Lưu valid parent types để dùng trong fetchChildrenForMove
            signZeroDiagram: false, // Biến điều khiển ẩn hiện dialog
            nodeForZeroDiagram: null, // Biến lưu node đang chọn
            isEditMode: false,
            isSaving: false,
            editingNode: null,
            moveTreeProps: {
                children: 'children',
                label: 'name',
                disabled: 'disabled'
            },
            properties: {
                region: '',
                name: '',
                plant: '',
                address: '',
                city: '',
                state_province: '',
                postal_code: '',
                country: '',
                phone_no: '',
                email: ''
            },
            assetProperties: {
                asset: '',
                asset_type: '',
                serial_no: '',
                manufacturer: '',
                manufacturer_type: '',
                manufacturing_year: '',
                apparatus_id: '',
                country: ''
            },
            jobProperties: {
                name: '',
                work_order: '',
                creation_date: '',
                execution_date: '',
                tested_by: '',
                approved_by: '',
                ambient_condition: '',
                standard: ''
            },
            propertiesClient: {
                region: '',
                name: '',
                plant: '',
                address: '',
                city: '',
                state_province: '',
                postal_code: '',
                country: '',
                phone_no: '',
                email: ''
            },
            assetPropertiesClient: {
                asset: '',
                asset_type: '',
                serial_no: '',
                manufacturer: '',
                manufacturer_type: '',
                manufacturing_year: '',
                apparatus_id: '',
                country: ''
            },
            jobPropertiesClient: {
                name: '',
                work_order: '',
                creation_date: '',
                execution_date: '',
                tested_by: '',
                approved_by: '',
                ambient_condition: '',
                standard: ''
            },
            logSign: false,
            logSignClient: false,
            propertiesSign: true,
            propertiesSignClient: true,
            clientSlide: true,
            pageLocationSync: {
                first: 1,
                second: 2,
                third: 3,
                dot: '...',
                end: 10
            },
            displayPageLocationSync: {
                second: true,
                third: true,
                dot: true,
                end: true
            },
            pageLocationSyncInstance: {
                first: '',
                second: '',
                third: '',
                dot: '',
                end: ''
            },
            currentLocationSync: {
                nextP: '',
                previousP: '',
                current: 1
            },
            optionLocationSync: {
                mode: ''
            },
            sl: 10,
            count: '',
            ownerServerList: [],
            clientList: [],
            ownerList: [],
            locationList: [],
            personList: [],
            AssetType: ['Transformer', 'Circuit breaker', 'Current transformer', 'Voltage transformer', 'Disconnector', 'Power cable', 'Surge arrester'],
            LocationType: ['location', 'voltage', 'feeder']
        }
    },
    computed: {
        // ...existing computed properties...
        isCommandAllowed() {
            return (cmd) => {
                const selectedNode = this.selectedNodes && this.selectedNodes.length > 0 ? this.selectedNodes[this.selectedNodes.length - 1] : null

                if (!selectedNode) return false
                return this.getAllowedCommands(selectedNode).includes(cmd)
            }
        },
        // Text + data hiển thị ví dụ: "Move from SourceNode to TargetNode" cùng icon
        // Nếu tên quá dài thì rút gọn 5 ký tự + '...' nhưng khi hover vẫn hiển thị full name
        moveDisplayText() {
            const nodeToMove = this.nodeToMove
            const targetNode = this.selectedTargetNode

            if (!nodeToMove || !targetNode) {
                return null
            }

            // Lấy tên đầy đủ của source
            // Với asset node: ưu tiên apparatus_id trước serial_number/serial_no
            let sourceFull
            if (nodeToMove.mode === 'asset') {
                sourceFull = nodeToMove.apparatus_id || nodeToMove.serial_number || nodeToMove.serial_no
            } else {
                sourceFull = nodeToMove.name || nodeToMove.serial_number || nodeToMove.serial_no
            }
            sourceFull = sourceFull || 'Unknown'

            // Lấy tên đầy đủ của target
            // Với asset node: ưu tiên apparatus_id trước serial_number/serial_no
            let targetFull
            if (targetNode.mode === 'asset') {
                targetFull = targetNode.apparatus_id || targetNode.serial_number || targetNode.serial_no
            } else {
                targetFull = targetNode.name || targetNode.serial_number || targetNode.serial_no
            }
            targetFull = targetFull || 'Unknown'

            // Rút gọn còn 5 ký tự + '...' nếu dài hơn 5
            const truncate = (text) => {
                const str = text != null ? text.toString() : ''
                return str.length > 5 ? str.slice(0, 9) + '...' : str
            }

            return {
                prefix: 'Move from',
                source: truncate(sourceFull),
                sourceFull,
                middle: 'to',
                target: truncate(targetFull),
                targetFull
            }
        },
        moveDisplayData() {
            const nodeToMove = this.nodeToMove
            const targetNode = this.selectedTargetNode

            if (!nodeToMove || !targetNode) {
                return {
                    sourceIcon: null,
                    targetIcon: null
                }
            }

            // Xác định icon cho source và target dựa trên mode
            const getIconConfig = (node) => {
                const mode = node.mode
                if (mode === 'substation') {
                    return { folderType: 'location', assetDetail: 'Unknown', badgeColor: '146EBE' }
                }
                if (mode === 'voltageLevel') {
                    return { folderType: 'voltageLevel', assetDetail: 'Unknown', badgeColor: '146EBE' }
                }
                if (mode === 'bay') {
                    return { folderType: 'bay', assetDetail: 'Unknown', badgeColor: '146EBE' }
                }
                if (mode === 'asset') {
                    return { folderType: 'asset', assetDetail: node.asset || 'Unknown', badgeColor: '146EBE' }
                }
                if (mode === 'job') {
                    return { folderType: 'job', assetDetail: 'Unknown', badgeColor: 'FF0000' }
                }
                if (mode === 'test') {
                    return { folderType: 'test', assetDetail: 'Unknown', badgeColor: '008001' }
                }
                // default: owner/building
                return { folderType: 'building', assetDetail: 'Unknown', badgeColor: '008001' }
            }

            const sourceIcon = getIconConfig(nodeToMove)
            const targetIcon = getIconConfig(targetNode)

            return {
                sourceIcon,
                targetIcon
            }
        },
        dialogClass() {
            return this.isDuplicating
                ? 'app-dialog ghost-dialog'
                : 'app-dialog'
        }
    },
    mixins: [mixin, mixinTreeNavigation, uploadNodeMixin, downloadNode],
    async beforeMount() {
        try {
            const data = await window.electronAPI.getAllConfigurationEvents()
            if (data && data.success) {
                this.logDataClient = data.data
            }
        } catch (error) {
            console.error('[TreeNavigation] API error:', error)
        }
    },
    mounted() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("tree:serverSwap", this.handleServerSwapEvent);
        window.addEventListener("tree:showLog", this.handleShowLogEvent);
        this.$nextTick(async () => {
            try {
                await this.showLocationRoot();
            } catch (error) {
                console.error('[TreeNavigation] showLocationRoot error:', error)
            }
        });
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("tree:serverSwap", this.handleServerSwapEvent);
        window.removeEventListener("tree:showLog", this.handleShowLogEvent);
    },
    methods: {
        handleServerSwapEvent(event) {
            const serverSign = event && event.detail ? event.detail.serverSign : true
            this.serverSwap(serverSign)
        },
        handleShowLogEvent(event) {
            const target = event && event.detail ? event.detail.target : 'server'
            if (target === 'server') {
                this.showLogBar()
            } else {
                this.showLogBarClient()
            }
        },
        handleUpdateNodeData(payload) {
            // ✅ Validation: Đảm bảo payload hợp lệ
            if (!payload || !payload.mrid || !payload.data) {
                return
            }

            const { mrid, data, mode, assetType } = payload

            // Tìm node trong tree
            const treeNode = this.findNodeById(mrid, this.organisationClientList)
            if (treeNode) {
                //console.log('[TREE-NAV] Found node in tree, updating with fresh data')
                //console.log('[TREE-NAV] Before update - node._cachedEntityData:', treeNode._cachedEntityData)

                if (mode === 'asset') {
                    // Update asset node - Robust mapping for both DTO and raw Entity
                    const apparatusId = data.properties?.apparatus_id || data.apparatus_id || data.name
                    const serialNumber = data.properties?.serial_no || data.serial_number || data.serial_no
                    const manufacturer = data.properties?.manufacturer || data.manufacturer
                    const assetTypeField = data.properties?.type || data.type || assetType

                    treeNode.apparatus_id = apparatusId
                    treeNode.name = apparatusId
                    treeNode.serial_number = serialNumber
                    treeNode.manufacturer = manufacturer
                    treeNode.type = assetTypeField
                    treeNode._hasFullProperties = true
                    treeNode._cachedEntityData = data
                } else if (mode === 'substation') {
                    // Update substation node
                    treeNode.name = data.name || ''
                    // ... existing fields ...
                    treeNode.type = data.type || ''
                    treeNode.generation = data.generation || ''
                    treeNode.industry = data.industry || ''
                    treeNode._hasFullProperties = true
                    treeNode._cachedEntityData = data
                } else if (mode === 'voltageLevel') {
                    treeNode.name = data.name || ''
                    treeNode._hasFullProperties = true
                    treeNode._cachedEntityData = data
                } else if (mode === 'bay') {
                    treeNode.name = data.name || ''
                    treeNode._hasFullProperties = true
                    treeNode._cachedEntityData = data
                } else {
                    treeNode.name = data.name || ''
                    treeNode.geo_x = data.x_position
                    treeNode.geo_y = data.y_position
                    treeNode.phone_no = data.phoneNumber
                    treeNode.email = data.email
                    treeNode._hasFullProperties = true
                    treeNode._cachedEntityData = data
                }

                // treeNode._cachedEntityData = data
            }

            // Refresh Zero Diagram if it is open - SHOULD BE OUTSIDE if(treeNode)
            if (this.signZeroDiagram && this.$refs.zeroDiagramDialog) {
                this.$refs.zeroDiagramDialog.refresh();
            }
        },
        async handleRefreshPropertiesClient(tab) {
            //console.log('[TREE-NAV] handleRefreshPropertiesClient called for tab:', tab)

            // ✅ Tìm node trong tree (node đã được update với _cachedEntityData)
            const treeNode = this.findNodeById(tab.mrid, this.organisationClientList)
            if (treeNode) {
                //console.log('[TREE-NAV] Found treeNode, using it instead of tab')
                //console.log('[TREE-NAV] treeNode._cachedEntityData:', treeNode._cachedEntityData)
                // Gọi showPropertiesDataClient với treeNode (có _cachedEntityData)
                await this.showPropertiesDataClient(treeNode)
            } else {
                //console.warn('[TREE-NAV] TreeNode not found, using tab as fallback')
                // Fallback: dùng tab nếu không tìm thấy node
                await this.showPropertiesDataClient(tab)
            }
        },
        async serverSwap(serverSign) {
            console.log('[serverSwap] Switching to:', serverSign ? 'server' : 'client')
            if (serverSign == true) {
                this.clientSlide = false
                if (this.ownerServerList.length === 0 && typeof this.showOwnerServerRoot === 'function') {
                    try {
                        await this.showOwnerServerRoot()
                        console.log('[serverSwap] Server tree data loaded, items:', this.ownerServerList.length)
                    } catch (error) {
                        console.error('[serverSwap] Failed to load server tree:', error)
                        this.$message?.error?.('Failed to load server tree: ' + (error.message || 'Unknown error'))
                    }
                }
            } else {
                this.clientSlide = true
            }
        },

        mappingProperties(data) {
            this.properties = mapProperties(data);
        },

        mappingAssetProperties(data) {
            this.assetProperties = mapAssetProperties(data);
        },

        mappingJobProperties(data) {
            this.jobProperties = mapJobProperties(data);
        },

        async mappingPropertiesClient(data) {
            this.propertiesClient = mapClientProperties(data)
        },

        async mappingAssetPropertiesClient(data) {
            this.assetPropertiesClient = mapClientAssetProperties(data)
        },

        async mappingJobPropertiesClient(data) {
            this.jobPropertiesClient.name = mapClientJobProperties(data)
        },

        async updateSelection(node) {
            this.selectedNodes = [...this.selectedNodes]
            if (Array.isArray(node)) {
                this.selectedNodes = [node]
            } else {
                // Ctrl + Click → bật/tắt node cha mà KHÔNG ảnh hưởng con
                // So sánh bằng mrid (vì mrid là unique) để nhất quán với TreeNode.vue
                // Chỉ so sánh khi cả hai node đều có mrid
                const index = this.selectedNodes.findIndex((n) => {
                    if (!n || !node) return false
                    if (!n.mrid || !node.mrid) return false
                    return n.mrid === node.mrid
                })
                if (index === -1) {
                    // Chưa có trong selection → thêm vào
                    this.selectedNodes.push(node)
                } else {
                    // Đã có trong selection → xóa khỏi selection
                    this.selectedNodes.splice(index, 1)
                }
            }
        },

        async clearSelection() {
            this.selectedNodes = []
        },

        async doubleClickNodeServer(node) {
            await this.showData(node)
            await this.showPropertiesData(node)
        },

        // Helper method to get component ref from dialog
        getDialogComponentRef(dialogRefName, componentRefName) {
            const dialogRef = this.$refs[dialogRefName]
            if (dialogRef && typeof dialogRef[`get${componentRefName}Ref`] === 'function') {
                return dialogRef[`get${componentRefName}Ref`]()
            }
            return null
        },

        // Helper method to reset form after successful save
        resetFormAfterSave(component) {
            this.$nextTick(() => {
                if (component && typeof component.resetForm === 'function') {
                    component.resetForm()
                }
            })

        },


        async handleMoveCancel() {
            this.moveDialogVisible = false
        },
        handleShowZeroDiagram(node) {
            this.nodeForZeroDiagram = node;
            this.signZeroDiagram = true;
        },
        handleZeroDiagramClose() {
            this.signZeroDiagram = false;
        },
        handleOpenImportDialog() {
            if (!this.selectedNodes || this.selectedNodes.length === 0) {
                this.$message.warning('Please select a node to import into!');
                return;
            }
            this.openImportDialog = true;
        },

        async handleImportConfirm(file) {
            // Đóng dialog (hoặc giữ lại tùy UX)
            this.openImportDialog = false;

            // Validation cơ bản
            if (!file) {
                return;
            }

            // Lấy đường dẫn file tuyệt đối (Electron hỗ trợ property .path trên File object)
            const filePath = file.path;
            const fileName = file.name;

            if (!filePath) {
                this.$message.error("Không tìm thấy đường dẫn file (File Path is missing)");
                return;
            }

            // Hiển thị Loading
            const { close } = startLoading(this, {
                action: 'import',
                customText: `Đang convert file ${fileName} qua Python...`,
                type: 'heavy'
            });

            try {
                // --- GỌI SANG ELECTRON MAIN PROCESS ĐỂ CHẠY PYTHON ---
                const jsonResult = await window.electronAPI.convertFileToJSON(filePath);

                if (jsonResult) {
                    this.$message.success("Convert thành công! Kiểm tra Console.");
                } else {
                    this.$message.warning("Python trả về dữ liệu rỗng.");
                }

            } catch (error) {
                console.error("Lỗi khi gọi Python Script:", error);
                this.$message.error(`Lỗi Convert: ${error.message || 'Unknown error'}`);
            } finally {
                // Tắt loading
                await close();
            }
        },
               async handleDeleteNodeFromDiagram(node, callback) {
            try {
                if (!this.clientSlide) {
                    this.$message.warning('Delete from server not implemented yet');
                    if (callback) callback(false);
                    return;
                }
                const originalMessage = this.$message;
                let deleteSuccess = false;
                this.$message = {
                    success: (msg) => { 
                        deleteSuccess = true; 
                        originalMessage.success(msg);
                    },
                    error: (msg) => { originalMessage.error(msg); },
                    warning: (msg) => { originalMessage.warning(msg); },
                    info: (msg) => { originalMessage.info(msg); }
                };

                try {
                    await this.deleteDataClient(node);
                } finally {
                    this.$message = originalMessage;
                }

                if (callback) callback(deleteSuccess);
            } catch (error) {
                console.error('Error deleting node from diagram:', error);
                this.$message.error('Failed to delete: ' + (error.message || 'Unknown error'));
                if (callback) callback(false);
            }
        },
        async handleNodeDeletedFromDiagram(node) {
  // Clear selection giống như xóa trên tree
  this.selectedNodes = [];
  // Đóng properties panel
  this.$emit('close-properties');
},
        async handleEditNodeFromDiagram(nodeData) {
            try {
                const type = nodeData.asset || nodeData.mode;
                if (!type) {
                    this.$message.warning('Cannot identify asset type for editing');
                    return;
                }

                this.isEditMode = true;
                this.editingNode = this.findNodeById(nodeData.mrid || nodeData.id, this.organisationClientList) || nodeData;

                // 1. Fetch Entity Data and Mapping
                let entityRes;
                let dto = null;

                // Close Zero Diagram first to avoid overlapping dialogs if needed, 
                // but user might want it open. Let's keep it open for now or close it?
                // The user said "edit ở zero là dialog", so usually we close the diagram or keep it under.
                // this.signZeroDiagram = false; 

                if (type === 'Transformer') {
                    entityRes = await window.electronAPI.getTransformerEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/Transformer/index');
                        dto = m.transformerEntityToDto(entityRes.data);
                    }
                } else if (type === 'Current transformer') {
                    entityRes = await window.electronAPI.getCurrentTransformerEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/CurrentTransformer/index');
                        dto = m.currentTransformerEntityToDto(entityRes.data);
                    }
                } else if (type === 'Voltage transformer') {
                    entityRes = await window.electronAPI.getVoltageTransformerEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/VoltageTransformer/index');
                        dto = m.voltageTransformerEntityToDto(entityRes.data);
                    }
                } else if (type === 'Circuit breaker' || type === 'Breaker') {
                    entityRes = await window.electronAPI.getBreakerEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/Breaker/index');
                        dto = m.breakerEntityToDto(entityRes.data);
                    }
                } else if (type === 'Power cable') {
                    entityRes = await window.electronAPI.getPowerCableEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/PowerCable/index');
                        dto = m.powerCableEntityToDto(entityRes.data);
                    }
                } else if (type === 'Disconnector') {
                    entityRes = await window.electronAPI.getDisconnectorEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/Disconnector/index');
                        dto = m.disconnectorEntityToDto(entityRes.data);
                    }
                } else if (type === 'Surge Arrester' || type === 'Surge arrester') {
                    entityRes = await window.electronAPI.getSurgeArresterEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/SurgeArrester/index');
                        dto = m.surgeArresterEntityToDto(entityRes.data);
                    }
                } else if (type === 'Reactor') {
                    entityRes = await window.electronAPI.getReactorEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/Reactor/index');
                        dto = m.reactorEntityToDto(entityRes.data);
                    }
                } else if (type === 'Capacitor') {
                    entityRes = await window.electronAPI.getCapacitorEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/Capacitor/index');
                        dto = m.capacitorEntityToDto(entityRes.data);
                    }
                } else if (type === 'Rotating machine') {
                    entityRes = await window.electronAPI.getRotatingMachineEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/RotatingMachine/index');
                        dto = m.rotatingEntityToDto(entityRes.data);
                    }
                } else if (type === 'Bushing') {
                    entityRes = await window.electronAPI.getBushingEntityByMrid(nodeData.mrid, nodeData.psrId);
                    if (entityRes.success && entityRes.data) {
                        const m = await import('@/views/Mapping/Bushing/index');
                        dto = m.bushingEntityToDto(entityRes.data);
                    }
                }

                if (dto) {
                    // 2. Open correct Dialog
                    await this.openAssetDialogForEdit(type, dto);
                } else {
                    this.$message.error('Failed to load asset data for editing');
                }

            } catch (error) {
                console.error('Error in handleEditNodeFromDiagram:', error);
                this.$message.error('Error: ' + error.message);
            }
        },

        async openAssetDialogForEdit(assetType, dto) {
            const dialogConfig = {
                'Transformer': { sign: 'signTransformer', ref: 'transformerDialog' },
                'Circuit breaker': { sign: 'signCircuit', ref: 'circuitBreakerDialog' },
                'Breaker': { sign: 'signCircuit', ref: 'circuitBreakerDialog' },
                'Current transformer': { sign: 'signCt', ref: 'currentTransformerDialog' },
                'Voltage transformer': { sign: 'signVt', ref: 'voltageTransformerDialog' },
                'Power cable': { sign: 'signPower', ref: 'powerCableDialog' },
                'Disconnector': { sign: 'signDisconnector', ref: 'disconnectorDialog' },
                'Surge Arrester': { sign: 'signSurge', ref: 'surgeArresterDialog' },
                'Surge arrester': { sign: 'signSurge', ref: 'surgeArresterDialog' },
                'Reactor': { sign: 'signReactor', ref: 'reactorDialog' },
                'Capacitor': { sign: 'signCapacitor', ref: 'capacitorDialog' },
                'Rotating machine': { sign: 'signRotating', ref: 'rotatingMachineDialog' },
                'Bushing': { sign: 'signBushing', ref: 'bushingDialog' }
            };

            const config = dialogConfig[assetType];
            if (!config) {
                this.$message.warning(`Asset type "${assetType}" dialog not configured`);
                return;
            }

            // Set parentOrganization to the parent of the currently editing node
            if (this.editingNode && this.editingNode.parentId) {
                this.parentOrganization = this.findNodeById(this.editingNode.parentId, this.organisationClientList);
            }

            this[config.sign] = true;
            
            // Wait for El-Dialog animation to complete (300ms) before calling loadData
            setTimeout(() => {
                const dialogRef = this.$refs[config.ref];
                const component = dialogRef ? dialogRef.getComponentRef() : null;
                if (component && component.loadData) {
                    component.loadData(dto);
                }
            }, 300);
        },
        async showAddOrganisation(node) {
            try {
                this.parentOrganization = node
                this.signOrg = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.organisationDialog
                    const org = dialogRef ? dialogRef.getOrganisationRef() : null
                    if (org) org.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddSubsInTree(node) {
            try {
                this.parentOrganization = node
                const [dataLocation, dataPerson] = await Promise.all([
                    window.electronAPI.getLocationByOrganisationId(node.mrid),
                    window.electronAPI.getPersonByOrganisationId(node.mrid)
                ])
                if (dataLocation.success) {
                    this.locationList = dataLocation.data
                } else {
                    this.locationList = []
                }
                if (dataPerson.success) {
                    this.personList = dataPerson.data
                } else {
                    this.personList = []
                }
                this.organisationId = node.mrid
                this.signSubs = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.substationDialog
                    const substation = dialogRef ? dialogRef.getSubstationRef() : null
                    if (substation) substation.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddSubs(organisationId) {
            try {
                const [dataLocation, dataPerson, parentOrganization] = await Promise.all([
                    window.electronAPI.getLocationByOrganisationId(organisationId),
                    window.electronAPI.getPersonByOrganisationId(organisationId),
                    window.electronAPI.getParentOrganizationByMrid(organisationId)
                ])
                if (dataLocation.success) {
                    this.locationList = dataLocation.data
                } else {
                    this.locationList = []
                }
                if (dataPerson.success) {
                    this.personList = dataPerson.data
                } else {
                    this.personList = []
                }
                if (parentOrganization.success) {
                    this.parentOrganization = parentOrganization.data
                } else {
                    this.parentOrganization = null
                }
                this.organisationId = organisationId
                this.signSubs = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.substationDialog
                    const substation = dialogRef ? dialogRef.getSubstationRef() : null
                    if (substation) substation.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddVoltageLevel(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signVoltageLevel = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.voltageLevelDialog
                    const voltageLevel = dialogRef ? dialogRef.getVoltageLevelRef() : null
                    if (voltageLevel) voltageLevel.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddBay(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signBay = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.bayDialog
                    const bay = dialogRef ? dialogRef.getBayRef() : null
                    if (bay) bay.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddTransformer(node) {
            try {
                this.locationId = null
                let psrId = null
                if (node.parentArr && node.parentArr.length >= 2) {
                    psrId = node.parentArr[1].mrid
                } else {
                    psrId = node.mrid
                }
                const dataLoction = await window.electronAPI.getLocationByPowerSystemResourceMrid(psrId)
                if (dataLoction.success) {
                    this.locationId = dataLoction.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signTransformer = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.transformerDialog
                    const transformer = dialogRef ? dialogRef.getTransformerRef() : null
                    if (transformer) transformer.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddBushing(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signBushing = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.bushingDialog
                    const bushing = dialogRef ? dialogRef.getBushingRef() : null
                    if (bushing) bushing.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddSurgeArrester(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signSurge = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.surgeArresterDialog
                    const surgeArrester = dialogRef ? dialogRef.getSurgeArresterRef() : null
                    if (surgeArrester) surgeArrester.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddCircuitBreaker(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signCircuit = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.circuitBreakerDialog
                    const circuitBreaker = dialogRef ? dialogRef.getCircuitBreakerRef() : null
                    if (circuitBreaker) circuitBreaker.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddCt(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signCt = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.currentTransformerDialog
                    const currentTransformer = dialogRef ? dialogRef.getCurrentTransformerRef() : null
                    if (currentTransformer) currentTransformer.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddVt(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signVt = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.voltageTransformerDialog
                    const voltageTransformer = dialogRef ? dialogRef.getVoltageTransformerRef() : null
                    if (voltageTransformer) voltageTransformer.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddPowerCable(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signPower = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.powerCableDialog
                    const powerCable = dialogRef ? dialogRef.getPowerCableRef() : null
                    if (powerCable) powerCable.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddDisconnector(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signDisconnector = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.disconnectorDialog
                    const disconnector = dialogRef ? dialogRef.getDisconnectorRef() : null
                    if (disconnector) disconnector.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddCapacitor(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signCapacitor = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.capacitorDialog
                    const capacitor = dialogRef ? dialogRef.getCapacitorRef() : null
                    if (capacitor) capacitor.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddReactor(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signReactor = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.reactorDialog
                    const reactor = dialogRef ? dialogRef.getReactorRef() : null
                    if (reactor) reactor.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddRotatingMachine(node) {
            try {
                const dataLocation = await window.electronAPI.getLocationByPowerSystemResourceMrid(node.mrid)
                if (dataLocation.success) {
                    this.locationId = dataLocation.data.mrid
                } else {
                    this.locationId = null
                }
                this.parentOrganization = node
                this.signRotating = true
                this.$nextTick(() => {
                    const dialogRef = this.$refs.rotatingMachineDialog
                    const rotatingMachine = dialogRef ? dialogRef.getRotatingMachineRef() : null
                    if (rotatingMachine) rotatingMachine.resetForm()
                })
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async showAddJob(node) {
            try {
                const dataAsset = await window.electronAPI.getAssetByMrid(node.mrid)
                if (dataAsset.success) {
                    this.assetData = dataAsset.data
                    const [dataLocation, dataProductAssetModel] = await Promise.all([
                        window.electronAPI.getLocationDetailByMrid(dataAsset.data.location),
                        window.electronAPI.getProductAssetModelByMrid(dataAsset.data.product_asset_model)
                    ])
                    if (dataLocation.success) {
                        this.locationData = dataLocation.data
                    } else {
                        this.locationData = {}
                    }
                    if (dataProductAssetModel.success) {
                        this.productAssetModelData = dataProductAssetModel.data
                    } else {
                        this.productAssetModelData = {}
                    }
                } else {
                    this.$message.error('Asset not found')
                }
                this.parentOrganization = node
                if (node.asset == 'Surge arrester') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Surge arrester")
                    const dataSurgeArrester = await window.electronAPI.getSurgeArresterByMrid(node.mrid)
                    if (dataSurgeArrester.success) this.assetData = dataSurgeArrester.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobSurgeArrester'
                    this.signJob = true
                    this.$nextTick(() => {
                        this.$refs.jobDialog.$refs.jobData.loadParameter(this.testTypeListData, this.assetData, this.productAssetModelData, this.locationData)
                    })
                } else if (node.asset == 'Power cable') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Power cable")
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobPowerCable'
                    this.signJob = true
                } else if (node.asset == 'Disconnector') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Disconnector")
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobDisconnector'
                    this.signJob = true
                } else if (node.asset == 'Current transformer') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Current transformer")
                    const dataCurrentTransformer = await window.electronAPI.getCurrentTransformerEntityByMrid(node.mrid)
                    if (dataCurrentTransformer.success) this.assetData = dataCurrentTransformer.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobCurrentTransformer'
                    this.signJob = true
                } else if (node.asset == 'Voltage transformer') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Voltage transformer")
                    const dataVoltageTransformer = await window.electronAPI.getVoltageTransformerEntityByMrid(node.mrid)
                    if (dataVoltageTransformer.success) {
                        this.assetData = dataVoltageTransformer.data
                        this.assetData.kind = this.assetData.asset.kind
                        this.assetData.type = this.assetData.asset.type
                        this.assetData.serial_number = this.assetData.asset.serial_number
                    } else {
                        this.assetData = {}
                    }
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobVoltageTransformer'
                    this.signJob = true
                } else if (node.asset == 'Circuit breaker') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Circuit breaker")
                    const dataBreakerEntity = await window.electronAPI.getBreakerEntityByMrid(node.mrid)
                    const dto = {}
                    if (dataBreakerEntity.success) this.assetData = dataBreakerEntity.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobCircuitBreaker'
                    this.signJob = true
                } else if (node.asset == 'Transformer') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Transformer")
                    const dataTransformerEntity = await window.electronAPI.getTransformerEntityByMrid(node.mrid)
                    if (dataTransformerEntity.success) this.assetData = dataTransformerEntity.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobTransformer'
                    this.signJob = true
                } else if (node.asset == 'Bushing') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Bushing")
                    const dataBushingEntity = await window.electronAPI.getBushingEntityByMrid(node.mrid)
                    if (dataBushingEntity.success) this.assetData = dataBushingEntity.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobBushing'
                    this.signJob = true
                } else if (node.asset == 'Capacitor') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Capacitor")
                    const dataCapacitorEntity = await window.electronAPI.getCapacitorEntityByMrid(node.mrid)
                    if (dataCapacitorEntity.success) this.assetData = dataCapacitorEntity.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobCapacitor'
                    this.signJob = true
                } else if (node.asset == 'Reactor') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Reactor")
                    const dataReactorEntity = await window.electronAPI.getReactorEntityByMrid(node.mrid)
                    if (dataReactorEntity.success) this.assetData = dataReactorEntity.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobReactor'
                    this.signJob = true
                } else if (node.asset == 'Rotating machine') {
                    const dataTestType = await window.electronAPI.getProcedureByGenericAssetModel("Rotating machine")
                    const dataRotatingMachineEntity = await window.electronAPI.getRotatingMachineEntityByMrid(node.mrid)
                    if (dataRotatingMachineEntity.success) this.assetData = dataRotatingMachineEntity.data
                    else this.assetData = {}
                    if (dataTestType.success) this.testTypeListData = dataTestType.data
                    else this.testTypeListData = []
                    this.checkJobType = 'JobRotatingMachine'
                    this.signJob = true
                } else {
                    this.$message.error('This asset type not support for job')
                }
            } catch (error) {
                this.parentOrganization = null
                this.$message.error('Some error occur')
                console.error(error)
            }
        },
        async handleOrgConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let orgRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.organisationDialog
                const org = dialogRef ? dialogRef.getOrganisationRef() : null
                if (org) {
                    orgRef = org;
                    const savePromise = org.saveOrganisation();
                    let result;
                    if (timeoutValue > 0) {
                        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue));
                        result = await Promise.race([savePromise, timeoutPromise]);
                    } else {
                        result = await savePromise;
                    }
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const newRow = {
                                mrid: data.organisation.mrid,
                                name: data.organisation.name || 'Unnamed Organisation',
                                parentId: this.parentOrganization ? this.parentOrganization.mrid : null,
                                parentName: this.parentOrganization ? this.parentOrganization.name : null,
                                parentArr: this.parentOrganization ? (this.parentOrganization.parentArr || []) : [],
                                mode: 'organisation'
                            }
                            newRows.push(newRow)
                            if (this.parentOrganization) {
                                const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                                if (node) {
                                    const children = Array.isArray(node.children) ? node.children : []
                                    node.children = [...children, ...newRows]
                                }
                            } else {
                                this.organisationClientList.push(newRow)
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Organisation saved successfully');
                this.signOrg = false;
                if (orgRef) this.resetFormAfterSave(orgRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        async handleOrgCancel() {
            this.signOrg = false
            const dialogRef = this.$refs.organisationDialog
            const org = dialogRef ? dialogRef.getOrganisationRef() : null
            if (org) this.resetFormAfterSave(org)
        },
        async handleSubsConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let subsRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.substationDialog
                const subs = dialogRef ? dialogRef.getSubstationRef() : null
                if (subs) {
                    subsRef = subs;
                    const savePromise = subs.saveSubstation();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const newRow = {
                                mrid: data.substation.mrid,
                                name: data.substation.name || 'Unnamed Substation',
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'substation'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Substation saved successfully');
                this.signSubs = false;
                if (subsRef) this.resetFormAfterSave(subsRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        async handleSubsCancel() {
            this.signSubs = false
            const dialogRef = this.$refs.substationDialog
            const subs = dialogRef ? dialogRef.getSubstationRef() : null
            if (subs) this.resetFormAfterSave(subs)
        },
        async handleVoltageLevelConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let voltageLevelRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.voltageLevelDialog
                const voltageLevel = dialogRef ? dialogRef.getVoltageLevelRef() : null
                if (voltageLevel) {
                    voltageLevelRef = voltageLevel;
                    const savePromise = voltageLevel.saveVoltageLevel();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const mrid = data.mrid || data.voltageLevel?.mrid || data.data?.voltageLevel?.mrid
                            const name = data.name || data.voltageLevel?.name || data.data?.voltageLevel?.name || 'Unnamed Voltage Level'
                            const newRow = {
                                mrid: mrid,
                                name: name,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'voltageLevel'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Voltage Level saved successfully');
                this.signVoltageLevel = false;
                if (voltageLevelRef) this.resetFormAfterSave(voltageLevelRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        async handleVoltageLevelCancel() {
            this.signVoltageLevel = false
            const dialogRef = this.$refs.voltageLevelDialog
            const voltageLevel = dialogRef ? dialogRef.getVoltageLevelRef() : null
            if (voltageLevel) this.resetFormAfterSave(voltageLevel)
        },
        async handleBayConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let bayRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.bayDialog
                const bay = dialogRef ? dialogRef.getBayRef() : null
                if (bay) {
                    bayRef = bay;
                    const savePromise = bay.saveBay();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const newRow = {
                                mrid: data.mrid,
                                name: data.name || 'Unnamed Bay',
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'bay'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Bay saved successfully');
                this.signBay = false;
                if (bayRef) this.resetFormAfterSave(bayRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        async handleBayCancel() {
            this.signBay = false
            const dialogRef = this.$refs.bayDialog
            const bay = dialogRef ? dialogRef.getBayRef() : null
            if (bay) this.resetFormAfterSave(bay)
        },
        async handleTransformerConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let transformerRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.transformerDialog
                const transformer = dialogRef ? dialogRef.getTransformerRef() : null
                if (transformer) {
                    transformerRef = transformer;
                    const savePromise = transformer.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        if (this.isEditMode) {
                            this.handleUpdateNodeData({ mrid: data.asset.mrid, data: data.asset, mode: 'asset', assetType: 'Transformer' });
                            try {
                                const entityRes = await window.electronAPI.getTransformerEntityByMrid(data.asset.mrid, data.assetPsr?.mrid);
                                if (entityRes.success && entityRes.data) {
                                    const dto = {};
                                    const dialogRef = this.$refs.transformerDialog;
                                    const component = dialogRef ? dialogRef.getComponentRef() : null;
                                    if (component && component.loadData) component.loadData(dto);
                                }
                            } catch (err) { console.error('Error reloading form after save:', err); }
                        } else {
                            let newRows = []
                            if (this.organisationClientList && this.organisationClientList.length > 0) {
                                const apparatusId = data.asset.name || data.asset.apparatus_id
                                const newRow = {
                                    mrid: data.asset.mrid,
                                    apparatus_id: apparatusId,
                                    name: apparatusId || data.asset.serial_number || 'Unnamed Transformer',
                                    serial_number: data.asset.serial_number,
                                    parentId: this.parentOrganization.mrid,
                                    parentName: this.parentOrganization.name,
                                    parentArr: this.parentOrganization.parentArr || [],
                                    mode: 'asset',
                                    asset: 'Transformer',
                                    type: data.asset.type
                                }
                                newRows.push(newRow)
                                const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                                if (node) {
                                    const children = Array.isArray(node.children) ? node.children : []
                                    node.children = [...children, ...newRows]
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Transformer saved successfully');
                this.signTransformer = false;
                this.isEditMode = false;
                if (transformerRef) this.resetFormAfterSave(transformerRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleTransformerCancel() {
            this.signTransformer = false
            const dialogRef = this.$refs.transformerDialog
            const transformer = dialogRef ? dialogRef.getTransformerRef() : null
            if (transformer) this.resetFormAfterSave(transformer)
            this.isEditMode = false
        },
        async handleBushingConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let bushingRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.bushingDialog
                const bushing = dialogRef ? dialogRef.getBushingRef() : null
                if (bushing) {
                    bushingRef = bushing;
                    const savePromise = bushing.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const bushingData = data.bushing
                        if (this.isEditMode) {
                            this.handleUpdateNodeData({ mrid: bushingData.mrid, data: bushingData, mode: 'asset', assetType: 'Bushing' });
                        } else {
                            let newRows = []
                            if (this.organisationClientList && this.organisationClientList.length > 0) {
                                const apparatusId = bushingData.name || bushingData.apparatus_id
                                const newRow = {
                                    mrid: bushingData.mrid,
                                    apparatus_id: apparatusId,
                                    name: apparatusId || bushingData.serial_number || 'Unnamed Bushing',
                                    serial_number: bushingData.serial_number,
                                    parentId: this.parentOrganization.mrid,
                                    parentName: this.parentOrganization.name,
                                    parentArr: this.parentOrganization.parentArr || [],
                                    mode: 'asset',
                                    asset: 'Bushing'
                                }
                                newRows.push(newRow)
                                const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                                if (node) {
                                    const children = Array.isArray(node.children) ? node.children : []
                                    node.children = [...children, ...newRows]
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Bushing saved successfully');
                this.signBushing = false;
                this.isEditMode = false;
                if (bushingRef) this.resetFormAfterSave(bushingRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleBushingCancel() {
            this.signBushing = false
            const dialogRef = this.$refs.bushingDialog
            const bushing = dialogRef ? dialogRef.getBushingRef() : null
            if (bushing) this.resetFormAfterSave(bushing)
            this.isEditMode = false
        },
        async handleSurgeConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let surgeRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.surgeArresterDialog
                const surgeArrester = dialogRef ? dialogRef.getSurgeArresterRef() : null
                if (surgeArrester) {
                    surgeRef = surgeArrester;
                    const savePromise = surgeArrester.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data.surgeArrester || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Surge Arrester',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Surge arrester'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Surge Arrester saved successfully');
                this.signSurge = false;
                this.isEditMode = false;
                if (surgeRef) this.resetFormAfterSave(surgeRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleSurgeCancel() {
            this.signSurge = false
            this.isEditMode = false
        },
        async handleCircuitConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let breakerRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.circuitBreakerDialog
                const breaker = dialogRef ? dialogRef.getCircuitBreakerRef() : null
                if (breaker) {
                    breakerRef = breaker;
                    const savePromise = breaker.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Circuit Breaker',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Circuit breaker',
                                type: assetData.type
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Circuit breaker saved successfully');
                this.signCircuit = false;
                this.isEditMode = false;
                if (breakerRef) this.resetFormAfterSave(breakerRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleCircuitCancel() {
            this.signCircuit = false
            const dialogRef = this.$refs.circuitBreakerDialog
            const breaker = dialogRef ? dialogRef.getCircuitBreakerRef() : null
            if (breaker) this.resetFormAfterSave(breaker)
            this.isEditMode = false
        },
        async handleCtConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let ctRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.currentTransformerDialog
                const ct = dialogRef ? dialogRef.getCurrentTransformerRef() : null
                if (ct) {
                    ctRef = ct;
                    const savePromise = ct.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Current Transformer',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Current transformer'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Current Transformer saved successfully');
                this.signCt = false;
                this.isEditMode = false;
                if (ctRef) this.resetFormAfterSave(ctRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleCtCancel() {
            this.signCt = false
            const dialogRef = this.$refs.currentTransformerDialog
            const ct = dialogRef ? dialogRef.getCurrentTransformerRef() : null
            if (ct) this.resetFormAfterSave(ct)
            this.isEditMode = false
        },
        async handleVtConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let vtRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.voltageTransformerDialog
                const vt = dialogRef ? dialogRef.getVoltageTransformerRef() : null
                if (vt) {
                    vtRef = vt;
                    const savePromise = vt.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Voltage Transformer',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Voltage transformer'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Voltage Transformer saved successfully');
                this.signVt = false;
                this.isEditMode = false;
                if (vtRef) this.resetFormAfterSave(vtRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleVtCancel() {
            this.signVt = false
            this.isEditMode = false
            const dialogRef = this.$refs.voltageTransformerDialog
            const vt = dialogRef ? dialogRef.getVoltageTransformerRef() : null
            if (vt) this.resetFormAfterSave(vt)
        },
        async handlePowerConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let powerRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.powerCableDialog
                const powerCable = dialogRef ? dialogRef.getPowerCableRef() : null
                if (powerCable) {
                    powerRef = powerCable;
                    const savePromise = powerCable.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Power Cable',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Power cable'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Power Cable saved successfully');
                this.signPower = false;
                this.isEditMode = false;
                if (powerRef) this.resetFormAfterSave(powerRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handlePowerCancel() {
            this.signPower = false
            const dialogRef = this.$refs.powerCableDialog
            const pow = dialogRef ? dialogRef.getPowerCableRef() : null
            if (pow) this.resetFormAfterSave(pow)
            this.isEditMode = false
        },
        async handleDisconnectorConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let disconnectorRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.disconnectorDialog
                const disconnector = dialogRef ? dialogRef.getDisconnectorRef() : null
                if (disconnector) {
                    disconnectorRef = disconnector;
                    const savePromise = disconnector.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Disconnector',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Disconnector'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Disconnector saved successfully');
                this.signDisconnector = false;
                this.isEditMode = false;
                if (disconnectorRef) this.resetFormAfterSave(disconnectorRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleDisconnectorCancel() {
            this.signDisconnector = false
            this.isEditMode = false
            const dialogRef = this.$refs.disconnectorDialog
            const disconnector = dialogRef ? dialogRef.getDisconnectorRef() : null
            if (disconnector) this.resetFormAfterSave(disconnector)
        },
        async handleCapacitorConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let capacitorRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.capacitorDialog
                const capacitor = dialogRef ? dialogRef.getCapacitorRef() : null
                if (capacitor) {
                    capacitorRef = capacitor;
                    const savePromise = capacitor.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Capacitor',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Capacitor'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Capacitor saved successfully');
                this.signCapacitor = false;
                this.isEditMode = false;
                if (capacitorRef) this.resetFormAfterSave(capacitorRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleCapacitorCancel() {
            this.signCapacitor = false
            const dialogRef = this.$refs.capacitorDialog
            const capacitor = dialogRef ? dialogRef.getCapacitorRef() : null
            if (capacitor) this.resetFormAfterSave(capacitor)
            this.isEditMode = false
        },
        async handleReactorConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let reactorRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.reactorDialog
                const reactor = dialogRef ? dialogRef.getReactorRef() : null
                if (reactor) {
                    reactorRef = reactor;
                    const savePromise = reactor.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Reactor',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Reactor'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Reactor saved successfully');
                this.signReactor = false;
                this.isEditMode = false;
                if (reactorRef) this.resetFormAfterSave(reactorRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleReactorCancel() {
            this.signReactor = false
            const dialogRef = this.$refs.reactorDialog
            const reactor = dialogRef ? dialogRef.getReactorRef() : null
            if (reactor) this.resetFormAfterSave(reactor)
            this.isEditMode = false
        },
        async handleRotatingConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let rotatingRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.rotatingMachineDialog
                const rotatingMachine = dialogRef ? dialogRef.getRotatingMachineRef() : null
                if (rotatingMachine) {
                    rotatingRef = rotatingMachine;
                    const savePromise = rotatingMachine.saveAsset();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        const assetData = data.asset || data
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            const apparatusId = assetData.name || assetData.apparatus_id
                            const newRow = {
                                mrid: assetData.mrid,
                                apparatus_id: apparatusId,
                                name: apparatusId || assetData.serial_number || 'Unnamed Rotating Machine',
                                serial_number: assetData.serial_number,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'asset',
                                asset: 'Rotating machine'
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Rotating Machine saved successfully');
                this.signRotating = false;
                this.isEditMode = false;
                if (rotatingRef) this.resetFormAfterSave(rotatingRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleRotatingCancel() {
            this.signRotating = false
            const dialogRef = this.$refs.rotatingMachineDialog
            const ro = dialogRef ? dialogRef.getRotatingMachineRef() : null
            if (ro) this.resetFormAfterSave(ro)
            this.isEditMode = false
        },
        async handleJobConfirm() {
            if (this.isSaving) return;
            this.isSaving = true;
            const { close, timeoutValue } = startLoading(this, { action: 'add', type: 'default' });
            const originalMessage = this.$message;
            let capturedMessages = [];
            let saveSuccess = false;
            let jobDataRef = null;
            this.$message = {
                success: (msg) => { capturedMessages.push({ type: 'success', message: msg }) },
                error: (msg) => { capturedMessages.push({ type: 'error', message: msg }) },
                warning: (msg) => { capturedMessages.push({ type: 'warning', message: msg }) },
                info: (msg) => { capturedMessages.push({ type: 'info', message: msg }) }
            };
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                const dialogRef = this.$refs.jobDialog
                const jobData = dialogRef ? dialogRef.getJobDataRef() : null
                if (jobData) {
                    jobDataRef = jobData;
                    const savePromise = jobData.saveJob();
                    let result = timeoutValue > 0 ? await Promise.race([savePromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeoutValue))]) : await savePromise;
                    const { success, data } = result;
                    if (success) {
                        saveSuccess = true;
                        let newRows = []
                        if (this.organisationClientList && this.organisationClientList.length > 0) {
                            let jobType = ''
                            if (this.checkJobType === 'JobSurgeArrester') jobType = 'Surge arrester'
                            else if (this.checkJobType === 'JobPowerCable') jobType = 'Power cable'
                            else if (this.checkJobType === 'JobDisconnector') jobType = 'Disconnector'
                            else if (this.checkJobType === 'JobCurrentTransformer') jobType = 'Current transformer'
                            else if (this.checkJobType === 'JobVoltageTransformer') jobType = 'Voltage transformer'
                            else if (this.checkJobType === 'JobCircuitBreaker') jobType = 'Circuit breaker'
                            else if (this.checkJobType === 'JobTransformer') jobType = 'Transformer'
                            else if (this.checkJobType === 'JobBushing') jobType = 'Bushing'
                            else if (this.checkJobType === 'JobCapacitor') jobType = 'Capacitor'
                            else if (this.checkJobType === 'JobReactor') jobType = 'Reactor'
                            else if (this.checkJobType === 'JobRotatingMachine') jobType = 'Rotating machine'
                            else jobType = 'Job'
                            const jobDataObj = data.oldWork || data.job || data
                            const newRow = {
                                mrid: jobDataObj.mrid,
                                name: jobDataObj.name || `Unnamed ${jobType} Job`,
                                parentId: this.parentOrganization.mrid,
                                parentName: this.parentOrganization.name,
                                parentArr: this.parentOrganization.parentArr || [],
                                mode: 'job',
                                job: jobType
                            }
                            newRows.push(newRow)
                            const node = this.findNodeById(this.parentOrganization.mrid, this.organisationClientList)
                            if (node) {
                                const children = Array.isArray(node.children) ? node.children : []
                                node.children = [...children, ...newRows]
                            }
                        }
                    }
                }
            } catch (error) {
                this.$message = originalMessage;
                await close();
                this.$message.error(error.message === 'Timeout' ? 'Save timed out' : 'Some error occur');
                console.error(error);
                this.isSaving = false;
                return;
            } finally {
                this.$message = originalMessage;
            }
            await close();
            if (capturedMessages.length > 0) {
                const last = capturedMessages[capturedMessages.length - 1];
                this.$message[last.type](last.message);
            }
            if (saveSuccess) {
                this.$message.success('Job saved successfully');
                this.signJob = false;
                if (jobDataRef) this.resetFormAfterSave(jobDataRef);
            }
            setTimeout(() => { this.isSaving = false; }, 300);
        },
        handleJobCancel() {
            this.signJob = false
            const dialogRef = this.$refs.jobDialog
            const jobData = dialogRef ? dialogRef.getJobDataRef() : null
            if (jobData) this.resetFormAfterSave(jobData)
        },
    }
}
</script>
<style scoped>
/* style.css */
.explorer {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    font-size: 12px;
    /* Giảm cỡ chữ toàn trang */
}

.explorer {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.resizable-sidebar {
    display: flex;
    height: calc(100% - 60px);
}

.resizer {
    width: 5px;
    background-color: white;
    cursor: ew-resize;
    /* Con trỏ đổi thành mũi tên kéo ngang */
}

.content {
    width: calc(75% - 5px);
    background-color: white;
    font-size: 12px;
    /* Cỡ chữ cho nội dung */
    box-sizing: border-box;
}

.title-content {
    width: 100%;
    height: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.content-content {
    width: 100%;
    height: calc(100% - 5px);
    box-sizing: border-box;
    border: 1px rgb(224, 222, 222) solid;
    border-bottom: none;
    overflow: hidden;
}

.content-content:hover {
    overflow: auto;
}

.folder-item {
    text-align: center;
    padding: 10px;
    border: 1px solid #ddd;
    cursor: pointer;
    font-size: 12px;
    /* Cỡ chữ cho các mục trong nội dung */
}

.folder-item:hover {
    background-color: #f0f0f0;
}

.title-node {
    margin-top: 50px;
}

.title-temp {
    height: 40px;
    color: #555;
    font-weight: 600;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    background-color: white;
}

.toolbar {
    background-color: #d9d9d9;
    height: 30px;
    display: flex;
    gap: 10px;
    border-bottom: 1px solid #cccccc;
    /* Độ dày 2px, màu đen */
    align-items: center;
    font-size: 12px;
    color: #555;
    font-weight: 600;
    box-sizing: border-box;
    width: 100%;
    padding-left: 10px;
}


.properties {
    width: 25%;
    height: 100%;
    box-sizing: border-box;
}

.title-properties {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.title-wrapper {
    width: 100%;
    height: 30px;
    border: 2px #b6b3b3 solid;
    display: flex;
    align-items: center;
    box-sizing: border-box;
}

.title-name {
    width: 100%;
    margin-left: 10px;
    color: black;
    font-weight: 750;
}

.content-properties {
    width: 100%;
    height: calc(100% - 40px);
    box-sizing: border-box;
    border: 1px #dad7d7 solid;
    border-bottom: none;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    background-color: #e2e8f0;
}

.content-properties::-webkit-scrollbar {
    display: none;
}

.content-properties-header {
    width: 100%;
    height: 40px;
    display: flex;
    background-color: #e2e8f0;
    align-items: center;
    box-sizing: border-box;
    padding-left: 10px;
}

.content-properties-table {
    width: 100%;
    box-sizing: border-box;
}

.content-properties-table-flex {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-color: white;
    box-sizing: border-box;
}

.content-properties-table-header {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 50%;
    box-sizing: border-box;
    padding-top: 5px;
    padding-bottom: 5px;
}

.content-properties-table-content {
    width: 50%;
    padding-top: 5px;
    padding-bottom: 5px;
    box-sizing: border-box;
    border-left: 3px #e2e8f0 solid;
}

.context-data {
    box-sizing: border-box;
    width: calc(80% - 5px);
    height: 100%;
}

.content-data {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
}

.log-bar {
    box-sizing: border-box;
    width: 100%;
    height: 20%;
    border: 1px rgb(224, 222, 222) solid;
}

.hide-icon i {
    visibility: hidden;
}

.hide-icon:hover i {
    visibility: visible;
}

.page-align {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}

.path-hover:hover {
    color: black;
    text-decoration: underline;
    cursor: pointer;
}
</style>

<style scoped>
.fixed-box {
    box-sizing: border-box;
}

.pl10 {
    padding-left: 10px;
}

.pt10 {
    padding-top: 10px;
}

.pb10 {
    padding-bottom: 10px;
}

.break-word {
    word-break: break-word;
}
</style>

<style>
/* Ẩn dialog và tất cả nội dung */
.ghost-dialog {
    visibility: hidden !important;
    opacity: 0 !important;
    display: none !important;
    pointer-events: none !important;
    transition: none !important;
    animation: none !important;
    transform: none !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
}

/* Ẩn backdrop/modal mask - Ẩn TẤT CẢ backdrop khi có dialog với class ghost-dialog */
body>.v-modal {
    transition: none !important;
}

/* Ẩn wrapper của dialog khi có class ghost-dialog */
.el-dialog__wrapper {
    transition: none !important;
}

/* Đảm bảo không có transition/animation khi duplicate */
.ghost-dialog * {
    transition: none !important;
    animation: none !important;
    transform: none !important;
}

/* Ẩn backdrop ngay lập tức khi có class ghost-dialog trong DOM */
body:has(.ghost-dialog) .v-modal,
.el-dialog__wrapper:has(.ghost-dialog) .v-modal {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
}

/* Fallback: Ẩn backdrop nếu browser không support :has() */
body .v-modal {
    transition: opacity 0s !important;
}

/* Ẩn backdrop khi body có class duplicating-mode */
body.duplicating-mode .v-modal {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    transition: none !important;
}



/* Ẩn tất cả backdrop ngay khi duplicate */
body.duplicating-mode>.v-modal {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
}
</style>
