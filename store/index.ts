// eslint-disable-next-line import/named
import { GetterTree, ActionTree, MutationTree } from 'vuex'
import UserTypeEnum from '~/models/UserTypeEnum'
import FileAction from '~/models/FileAction'

export const state = () => ({
  pageName: '',
  pdfPageName: {},
  pdfUser: [],
  savedFiles: [{ favourite: 0 }],
  originalPdfFiles: [],
  filterUser: '',
  setPackage: {},
  initialUser: {},
  createPackage: undefined,
  beTeamMember: true as any,
  editAnnotation: true,
  loadedPdfFile: {},
  pdfExit: false,
  pdfScale: 1.305,
  pdfOffset_y: 0,
  pdfOffset_x: 0,
  scrollPosition: false,
  upload_state: false,
  showCongratulationsModal: false,
  agreeSign: -1
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  profilePhoto(state: any) {
    const user = state.auth.user
    if (!user) return ''

    if (user.profilePicture != null) return user.profilePicture

    return '/img/placeholder_picture.png'
  },
  userType(state: any) {
    const user = state.auth.user
    if (!user) return ''
    // return UserTypeEnum.PAID

    return user.role

    // return UserTypeEnum.FREE === 'free_user'

    // const userType = (<any>UserTypeEnum)[user.role]

    // if (!userType) return UserTypeEnum.FREE
    // else return userType

    // // switch (user.role) {
    // //   case 'free_user':
    // //     return UserTypeEnum.FREE
    // //   case 'paid_user':
    // //     return UserTypeEnum.PAID
    // //   default:
    // //     return UserTypeEnum.FREE
    // // }
  },
}

export const mutations: MutationTree<RootState> = {
  // -- Setting the user --
  SET_PAGE_USER(state, user) {
    state.initialUser = user
  },
  SET_CONGRAT_SUCCESS(state) {
    state.showCongratulationsModal = true
  },
  SET_AGREE_SIGN(state) {
    state.agreeSign = 1;
  },
  UN_SET_AGREE_SIGN(state) {
    state.agreeSign = 0;
  },
  // -- Setting the routed page name --
  SET_PAGE_NAME(state, { name }: { name: string }) {
    state.pageName = name
  },

  // -- Setting the pdf page name --
  SET_PDF_PAGE_NAME(state, pdfRouteObj: object) {
    state.pdfPageName = pdfRouteObj
  },
  // -- Setting the pdf page name --
  SET_PDF_EXIT(state, pdfExitPayload: boolean) {
    state.pdfExit = pdfExitPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_Y(state, pdfOffsetPayload: number) {
    state.pdfOffset_y = pdfOffsetPayload
  },
  // -- Setting the pdf page name --
  SET_PDF_OFFSET_X(state, pdfOffsetPayload: number) {
    state.pdfOffset_x = pdfOffsetPayload
  },
  // -- All info from a package --
  PACKAGE_INFO(state, info) {
    state.setPackage = info
  },

  // -- All info from a package --
  TEAM_MEMBER(state, team) {
    state.beTeamMember = team
  },

  // -- Setting a variable for custom package --
  PACKAGE_CREATE(state, condition) {
    state.createPackage = condition
  },

  // -- Getting all user file --
  FILTER_USERs(state, filter) {
    // set the initial state
    state.pdfUser = state.originalPdfFiles
    switch (filter.toLowerCase()) {
      case FileAction.LEDGER:
        (state.pdfUser as any) = state.pdfUser
        break;
      case FileAction.SHARED:
        (state.pdfUser as any) = (state.pdfUser as any).filter((e: any) => e.shared != null)
        break;
      case FileAction.SAVED:
        (state.pdfUser as any) = (state.pdfUser as any).filter((e: any) => e.favourites.length > 0)
        break;
      default:
        (state.pdfUser as any) = (state.pdfUser as any).filter((e: any) => e.fileAction == filter.toLowerCase())
        break
    }
  },
  FILTER_SAVED_USERs(state, filter) {
    // set the initial state
    state.savedFiles = state.originalPdfFiles
    switch (filter.toLowerCase()) {
      case FileAction.LEDGER:
        (state.savedFiles as any) = state.savedFiles
        break;
      case FileAction.SHARED:
        (state.savedFiles as any) = (state.savedFiles as any).filter((e: any) => e.shared != null)
        break;
      case FileAction.SAVED:
        (state.savedFiles as any) = (state.savedFiles as any).filter((e: any) => e.favourites.length > 0)
        break;
      default:
        (state.savedFiles as any) = (state.savedFiles as any).filter((e: any) => e.fileAction == filter.toLowerCase())
        break
    }
  },

  // -- Resetting the state of the total user-files --
  ADD_USER(state, pdfFiles) {
    state.pdfUser = pdfFiles
    state.originalPdfFiles = pdfFiles
  },
  ADD_SAVE_USER(state, pdfFiles) {
    state.savedFiles = pdfFiles
    state.originalPdfFiles = pdfFiles
  },
  SEARCH_SAVED_FILES(state, search) {
    let ary = [{ favourite: 0 }];
    if (search == '') {
      state.savedFiles = state.originalPdfFiles
    } else {
      ary.pop();
      state.originalPdfFiles.map((val: any) => {
        val['fileName'].toLowerCase().indexOf(search) != -1 && ary.push(val);
      })
      state.savedFiles = [...ary]
    }
  },
  SET_EDIT_ANNOTATION(state, condition) {
    state.editAnnotation = condition
  },
  SET_LOADED_PDF(state, pdfFile) {
    state.loadedPdfFile = pdfFile
  },
  SET_UPLOAD_STATE(state, val) {
    state.upload_state = val
  },
  SET_PDF_PAGE_BOTTOM(state) {
    state.scrollPosition = true;
  }
}

export const actions: ActionTree<RootState, RootState> = {}
