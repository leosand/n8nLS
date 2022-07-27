import Vue from 'vue';

import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import {
	faAngleDoubleLeft,
	faAngleDown,
	faAngleRight,
	faAngleUp,
	faArrowLeft,
	faArrowRight,
	faAt,
	faBook,
	faBoxOpen,
	faBug,
	faCalendar,
	faCheck,
	faCheckCircle,
	faChevronDown,
	faChevronUp,
	faChevronLeft,
	faChevronRight,
	faCode,
	faCodeBranch,
	faCog,
	faCogs,
	faClock,
	faClone,
	faCloud,
	faCloudDownloadAlt,
	faCopy,
	faCube,
	faCut,
	faDotCircle,
	faEdit,
	faEllipsisV,
	faEnvelope,
	faEye,
	faExclamationTriangle,
	faExpand,
	faExternalLinkAlt,
	faExchangeAlt,
	faFile,
	faFileArchive,
	faFileCode,
	faFileDownload,
	faFileExport,
	faFileImport,
	faFilePdf,
	faFolderOpen,
	faGlobeAmericas,
	faGift,
	faGraduationCap,
	faGripVertical,
	faHdd,
	faHome,
	faHourglass,
	faImage,
	faInbox,
	faInfo,
	faInfoCircle,
	faKey,
	faLink,
	faLightbulb,
	faMapSigns,
	faNetworkWired,
	faPause,
	faPauseCircle,
	faPen,
	faPencilAlt,
	faPlay,
	faPlayCircle,
	faPlug,
	faPlus,
	faPlusCircle,
	faPlusSquare,
	faQuestion,
	faQuestionCircle,
	faRedo,
	faRss,
	faSave,
	faSearch,
	faSearchMinus,
	faSearchPlus,
	faServer,
	faSignInAlt,
	faSlidersH,
	faSpinner,
	faStop,
	faSun,
	faSync,
	faSyncAlt,
	faTable,
	faTasks,
	faTerminal,
	faThLarge,
	faThumbtack,
	faTimes,
	faTimesCircle,
	faTrash,
	faUndo,
	faUnlink,
	faUser,
	faUserCircle,
	faUserFriends,
	faUsers,
	faVideo,
	faStickyNote as faSolidStickyNote,
} from '@fortawesome/free-solid-svg-icons';
import {
	faStickyNote,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

function addIcon(icon: any) { // tslint:disable-line:no-any
	library.add(icon as IconDefinition);
}

addIcon(faAngleDoubleLeft);
addIcon(faAngleDown);
addIcon(faAngleRight);
addIcon(faAngleUp);
addIcon(faArrowLeft);
addIcon(faArrowRight);
addIcon(faAt);
addIcon(faBook);
addIcon(faBoxOpen);
addIcon(faBug);
addIcon(faCalendar);
addIcon(faCheck);
addIcon(faCheckCircle);
addIcon(faChevronLeft);
addIcon(faChevronRight);
addIcon(faChevronDown);
addIcon(faChevronUp);
addIcon(faCode);
addIcon(faCodeBranch);
addIcon(faCog);
addIcon(faCogs);
addIcon(faClock);
addIcon(faClone);
addIcon(faCloud);
addIcon(faCloudDownloadAlt);
addIcon(faCopy);
addIcon(faCube);
addIcon(faCut);
addIcon(faDotCircle);
addIcon(faGripVertical);
addIcon(faEdit);
addIcon(faEllipsisV);
addIcon(faEnvelope);
addIcon(faEye);
addIcon(faExclamationTriangle);
addIcon(faExpand);
addIcon(faExternalLinkAlt);
addIcon(faExchangeAlt);
addIcon(faFile);
addIcon(faFileArchive);
addIcon(faFileCode);
addIcon(faFileDownload);
addIcon(faFileExport);
addIcon(faFileImport);
addIcon(faFilePdf);
addIcon(faFolderOpen);
addIcon(faGift);
addIcon(faGlobeAmericas);
addIcon(faGraduationCap);
addIcon(faHdd);
addIcon(faHome);
addIcon(faHourglass);
addIcon(faImage);
addIcon(faInbox);
addIcon(faInfo);
addIcon(faInfoCircle);
addIcon(faKey);
addIcon(faLink);
addIcon(faLightbulb);
addIcon(faMapSigns);
addIcon(faNetworkWired);
addIcon(faPause);
addIcon(faPauseCircle);
addIcon(faPen);
addIcon(faPencilAlt);
addIcon(faPlay);
addIcon(faPlayCircle);
addIcon(faPlug);
addIcon(faPlus);
addIcon(faPlusCircle);
addIcon(faPlusSquare);
addIcon(faQuestion);
addIcon(faQuestionCircle);
addIcon(faRedo);
addIcon(faRss);
addIcon(faSave);
addIcon(faSearch);
addIcon(faSearchMinus);
addIcon(faSearchPlus);
addIcon(faServer);
addIcon(faSignInAlt);
addIcon(faSlidersH);
addIcon(faSpinner);
addIcon(faSolidStickyNote);
addIcon(faStickyNote);
addIcon(faStop);
addIcon(faSun);
addIcon(faSync);
addIcon(faSyncAlt);
addIcon(faTable);
addIcon(faTasks);
addIcon(faTerminal);
addIcon(faThLarge);
addIcon(faThumbtack);
addIcon(faTimes);
addIcon(faTimesCircle);
addIcon(faTrash);
addIcon(faUndo);
addIcon(faUnlink);
addIcon(faUser);
addIcon(faUserCircle);
addIcon(faUserFriends);
addIcon(faUsers);
addIcon(faVideo);

Vue.component('font-awesome-icon', FontAwesomeIcon);

