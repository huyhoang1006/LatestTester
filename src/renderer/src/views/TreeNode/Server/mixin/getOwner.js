import * as demoAPI from '@/api/demo'

export default {
    methods: {
        async getOwnerLocation() {
            try {
                console.log('[getOwnerLocation] Calling demoAPI.getOwnerOrganisation()')
                console.log('[getOwnerLocation] client.defaults.baseURL:', window.electronAPI ? 'IPC available' : 'no IPC')
                const res = await demoAPI.getOwnerOrganisation()
                console.log('[getOwnerLocation] Response received:', res)
                if (res !== null && res !== undefined) {
                    this.ownerServerList = [res].map((item) => {
                        return {
                            id: item.id || item.mrid || '',
                            name: item.name || '',
                            aliasName: item.shortName || item.name || item.aliasName || '',
                            parentName: '',
                            parentArr: [],
                            //mode: item.mode || '',
                            parentId: '',
                            mode: 'organisation',
                            mrid: item.mrid || item.id || ''
                        }
                    })
                    console.log('[getOwnerLocation] ownerServerList populated:', this.ownerServerList)
                } else {
                    this.ownerServerList = []
                    this.$message.warning('Không tìm thấy dữ liệu tổ chức chủ sở hữu.')
                }
            } catch (error) {
                this.$message.error('Có lỗi xảy ra khi lấy danh sách tổ chức chủ sở hữu.')
                console.error('[getOwnerLocation] error:', error)
                console.error('[getOwnerLocation] error.response:', error.response?.data)
                console.error('[getOwnerLocation] error.config.url:', error.config?.url)
                this.ownerServerList = []
            }
        },
    }
}