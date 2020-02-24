import Mock from 'mockjs'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mock-Pan' })

export default [
  // username search
  {
    url: '/vue-element-admin/search/user',
    type: 'get',
    response: config => {
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return {
        code: 20000,
        data: { items: mockNameList }
      }
    }
  },

  // transaction list
  {
    url: '/vue-element-admin/transaction/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 20,
          'items|20': [{
            'no|+1': 1,
            order_no: '@guid()',
            'current_step|1': ['1', '2', '3', '4'],
            'status|1': ['pending', 'complete', 'in progress', 'failed'],
            'jenisKelamin|1': ['LAKI-LAKI', 'PEREMPUAN'],
            namaLengkap: '@name()',
            tempatLahir: '@city()',
            tanggalLahir: '@date("dd/MM/yyyy")',
            aktaLahir: '',
            nomorAktaLahir: null,
            agama: "",
            'statusKawin|1': ["KAWIN", "BELUM KAWIN"],
            nomorAktaKawin: "",
            tanggalKawin: "",
            aktaKawin: "",
            email: '@email()',
            nomorAktaCerai: "",
            tanggalCerai: "",
            "nomorKK|+1": 100,
            pendidikanAkhir: "DIPLOMA IV/STRATA I",
            'jenisPekerjaan|1': ["KARYAWAN SWASTA", "PNS", "WIRASWASTA"],
            namaAyah: "@name()",
            namaIbu: "@name()",
            namaProvinsi: "@province()",
            namaKabupaten: "@region()",
            namaKecamatan: "@city()",
            namaKelurahan: "@city()",
            alamat: "@city()",
            nomorRt: "6",
            nomorRw: "15",
            desa: "CIKEMBANG",
            kodePos: "@zip()",
            'golonganDarah|1': ["O+", "O-", "A", "AB", "B"],
            hubunganKeluarga: "KEPALA KELUARGA",
            penyandangCacat: null,
            tanggalPembuatanEktp: '@date("dd/MM/yyyy")',
            'statusEktp:1': ["Active", "Non-Active"],
            responseCode: "00",
            responseDesc: "Sukses",
            foto: "dummy.jpg",
            selfieFile: "dummy.jpg",
            gajiFile: "dummy.jpg",
            ktpFile: "dummy.jpg",
            tandaTangan: null,
            noAktaLahir: ""
          }]
        }
      }
    }
  }
]
