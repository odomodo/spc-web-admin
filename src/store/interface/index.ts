// 接口类型声明

// 布局配置
export interface ThemeConfigState {
	themeConfig: {
		isDrawer: boolean;
		primary: string;
		topBar: string;
		topBarColor: string;
		isTopBarColorGradual: boolean;
		menuBar: string;
		menuBarColor: string;
		isMenuBarColorGradual: boolean;
		columnsMenuBar: string;
		columnsMenuBarColor: string;
		isColumnsMenuBarColorGradual: boolean;
		isCollapse: boolean;
		isUniqueOpened: boolean;
		isFixedHeader: boolean;
		isFixedHeaderChange: boolean;
		isClassicSplitMenu: boolean;
		isLockScreen: boolean;
		lockScreenTime: number;
		isShowLogo: boolean;
		isShowLogoChange: boolean;
		isBreadcrumb: boolean;
		isTagsview: boolean;
		isBreadcrumbIcon: boolean;
		isTagsviewIcon: boolean;
		isCacheTagsView: boolean;
		isSortableTagsView: boolean;
		isShareTagsView: boolean;
		isFooter: boolean;
		isGrayscale: boolean;
		isInvert: boolean;
		isIsDark: boolean;
		isWartermark: boolean;
		wartermarkText: string;
		tagsStyle: string;
		animation: string;
		columnsAsideStyle: string;
		columnsAsideLayout: string;
		layout: string;
		isRequestRoutes: boolean;
		globalTitle: string;
		globalViceTitle: string;
		globalI18n: string;
		globalComponentSize: string;
	};
}

// 路由列表
export interface RoutesListState {
	routesList: object[];
	isColumnsMenuHover: Boolean;
	isColumnsNavHover: Boolean;
}

// 路由缓存列表
export interface KeepAliveNamesState {
	keepAliveNames: string[];
}

// TagsView 路由列表
export interface TagsViewRoutesState {
	tagsViewRoutes: object[];
	isTagsViewCurrenFull: Boolean;
}

// 用户信息
export interface UserInfosState {
	userInfos: {
		authBtnList: string[];
		photo: string;
		roles: string[];
		time: number;
		userName: string;
		token: string | undefined,
		avatar: string,
		permissions: string[],
		menuList: string[],
		account: null,
		isPerms: string |undefined,
		factory: {}
	};
}

// 后端返回原始路由(未处理时)
export interface RequestOldRoutesState {
	requestOldRoutes: object[];
}
export interface RowConfigState {
	
		id?: string,
		factoryCode?: string,
		scpControlGroupId?: string,
		controlChartConfigCode?: string,
		controlChartCode?: string,
		inspcationCode?: string,
		usl?: number,
		target?: number,
		lsl?: number,
		sampleSize?: number,
		decimalPlaces?: number,
		uclX?: number,
		clX?: number,
		lclX?: number,
		uclR?: number,
		clR?: number,
		lclR?: number,
		addUserId?: string,
		addTime?: string,
		itemDecRuleConfigList?: [],
		tSpcControlGroupItemHierarchyList?: [
			{
				id?: string,
				factoryCode?: string,
				spcControlGroupItemId?: string,
				controlItemCode?: string,
				controlItemValue?: string,
				type?: 0,
				addUserId?: string,
				editUserId?: string,
				addTime?: string
			}
		]
	
}
export interface TableConfigState {
		parentId: string,		//父ID
		tableData: Array<{}>, //要加载的数据
		rowKey: string,			// 表格key
		columns: Array<{type?:string,color?: string, prop?: string,label?:string}>, //显示字段
		height: number, //表格高度
		stripe: boolean, //是否为斑马纹，默认false
		border: boolean, //是否带有纵向边框 false
		fit: boolean, //列的宽度是否自撑开
		showHeader: boolean, //是否显示表头
		highlightCurrentRow: boolean, //是否要高亮当前行
		row: {							// 添加行的变量
			id?: string,
			sampleTime?: string,
			entryTime?: string,
			status?: number,
			averageValue?: string,
			rangeValue?: string,
			standardDeviation?: string,
			maximum?: string,
			minimum?: string,
			inputUser?: string,
			editable?: number,
		},
		decimalPlaces: number, //小数点位
		sampleSize: number,		// 样本大小
		type:string,			//图表类型
	}

export interface InputDataState {
	rowConfig: RowConfigState,
	tableConfig: TableConfigState
}

export interface CountingState {
	rowConfig: RowConfigState,
	tableConfig: TableConfigState
}
export interface MetrologicalState {
	rowConfig: RowConfigState,
	tableConfig: TableConfigState
}


// 主接口(顶级类型声明)
export interface RootStateTypes {
	themeConfig: ThemeConfigState;
	routesList: RoutesListState;
	keepAliveNames: KeepAliveNamesState;
	tagsViewRoutes: TagsViewRoutesState;
	userInfos: UserInfosState;
	requestOldRoutes: RequestOldRoutesState;
	inputData: InputDataState;
	counting: CountingState;
	metrological: MetrologicalState;
	
}
