import { icons, iconsPascalCase } from './Icons';

import createIconComponent, { IconComponent } from './IconTemplate';

const iconComponents: Record<string, IconComponent> = {} as any;

for (const [index, iconName] of Object.entries(icons)) {
  const pascalCasedIconName = iconsPascalCase[parseInt(index)];

  iconComponents[pascalCasedIconName] = createIconComponent(iconName);
}

export const { Search, Home, Menu, Close, Settings, Done, ExpandMore, CheckCircle, Favorite, Add, Delete, ArrowBack, Star, ChevronRight, Logout, ArrowForwardIos, AddCircle, Cancel, ArrowBackIos, ArrowForward, ArrowDropDown, MoreVert, Check, CheckBox, ToggleOn, Grade, OpenInNew, CheckBoxOutlineBlank, Refresh, Login, ChevronLeft, ExpandLess, RadioButtonUnchecked, MoreHoriz, Apps, ArrowRightAlt, RadioButtonChecked, Download, Remove, ToggleOff, Bolt, ArrowUpward, FilterList, DeleteForever, Autorenew, Key, ArrowDownward, Sort, Sync, Block, AddBox, ArrowBackIosNew, RestartAlt, MenuOpen, ShoppingCartCheckout, ExpandCircleDown, Backspace, ArrowCircleRight, Undo, DoneAll, ArrowRight, DoNotDisturbOn, OpenInFull, DoubleArrow, ManageSearch, SyncAlt, ZoomIn, DoneOutline, DragIndicator, Fullscreen, KeyboardDoubleArrowRight, StarHalf, SettingsAccessibility, IosShare, ArrowDropUp, Reply, ExitToApp, UnfoldMore, LibraryAdd, Cached, SelectCheckBox, Terminal, ChangeCircle, DisabledByDefault, SwapHoriz, SwapVert, AppRegistration, CloseFullscreen, DownloadForOffline, ArrowCircleLeft, ArrowCircleUp, FileOpen, Minimize, OpenWith, KeyboardDoubleArrowLeft, Dataset, AddTask, Start, KeyboardDoubleArrowDown, KeyboardVoice, CreateNewFolder, Forward, Downloading, SettingsApplications, CompareArrows, Redo, ArrowLeft, Publish, ZoomOut, Html, Token, SwitchAccessShortcut, ArrowCircleDown, FullscreenExit, SortByAlpha, DeleteSweep, IndeterminateCheckBox, FirstPage, KeyboardDoubleArrowUp, ViewTimeline, ArrowDropDownCircle, SettingsBackupRestore, AssistantNavigation, SyncProblem, ClearAll, DensityMedium, HeartPlus, FilterAltOff, LastPage, Expand, SubdirectoryArrowRight, UnfoldLess, DownloadDone, ArrowOutward, '123': OneTwoThree, SwipeLeft, AutoMode, SavedSearch, SystemUpdateAlt, PlaceItem, Maximize, Javascript, Output, SearchOff, SwipeUp, FitScreen, SelectAll, DynamicForm, HideSource, SwipeRight, SwitchAccessShortcutAdd, BrowseGallery, Css, DensitySmall, CheckSmall, AssistantDirection, MoveUp, FileDownloadDone, YoutubeSearchedFor, SwapHorizontalCircle, DataThresholding, InstallMobile, MoveDown, RestoreFromTrash, DatasetLinked, Abc, Enable, InstallDesktop, KeyboardCommandKey, ViewKanban, BrowseActivity, ReplyAll, SwitchLeft, Compress, SwipeDown, SwapVerticalCircle, RemoveDone, FilterListOff, AppsOutage, SwitchRight, StarRate, Hide, SwipeVertical, MoreUp, SyncDisabled, Pinch, KeyboardControlKey, Eject, KeyOff, Php, SubdirectoryArrowLeft, ViewCozy, Transcribe, DoNotDisturbOff, SendTimeExtension, WidthNormal, HeartMinus, ViewComfyAlt, ShareReviews, WidthFull, UnfoldMoreDouble, ViewCompactAlt, FileDownloadOff, ExtensionOff, OpenInNewOff, CheckIndeterminateSmall, MoreDown, WidthWide, Repartition, SwipeLeftAlt, DensityLarge, SwipeDownAlt, SwipeRightAlt, SwipeUpAlt, UnfoldLessDouble, KeyboardOptionKey, Hls, HlsOff, Cycle, FileUploadOff, Rebase, RebaseEdit, ExpandContent, EmptyDashboard, MagicExchange, QuickReferenceAll, QuickReference, SyncSavedLocally, LeftClick, DeployedCode, ClockLoader_60, Acute, DataCheck, DataAlert, DataInfoAlert, Preliminary, CaptivePortal, PointScan, NewWindow, SearchCheck, StarRateHalf, StepInto, ClockLoader_40, ClockLoader_10, MagnificationSmall, LeftPanelClose, MagnificationLarge, ClockLoader_90, DragPan, QuestionExchange, BottomPanelOpen, PatientList, Stack, UnknownMed, Capture, LeftPanelOpen, ArrowInsert, MoveGroup, ChipExtraction, StackOff, ClockLoader_20, InputCircle, Resize, Iframe, PageInfo, StackStar, Chronic, ClockLoader_80, RightPanelClose, Step, BottomRightClick, GoToLine, ShelfPosition, AllMatch, RightClick, StepOut, DragClick, ErrorMed, RuleSettings, StepOver, HeartCheck, Pip, AppBadging, OutputCircle, ReopenWindow, RightPanelOpen, ShelfAutoHide, Amend, ArrowTopRight, EventList, ArrowRange, Bubbles, JumpToElement, MoveSelectionRight, MoveSelectionUp, OpenInNewDown, ArrowTopLeft, ArrowsOutward, BackToTab, BottomPanelClose, IframeOff, MoveSelectionDown, PositionBottomLeft, PositionBottomRight, PositionTopRight, ShareWindows, SwitchAccess, DeployedCodeAlert, DeployedCodeHistory, DeployedCodeUpdate, MoveSelectionLeft, PipExit, Person, Group, Share, ThumbUp, Groups, PersonAdd, Public, Handshake, SupportAgent, Face, SentimentSatisfied, RocketLaunch, GroupAdd, WorkspacePremium, Psychology, Diversity_3, EmojiObjects, WaterDrop, Eco, Pets, TravelExplore, Mood, Sunny, Quiz, HealthAndSafety, SentimentDissatisfied, SentimentVerySatisfied, MilitaryTech, ThumbDown, Gavel, Recycling, Diamond, MonitorHeart, EmojiPeople, Diversity_1, Workspaces, Vaccines, Compost, Forest, Recommend, WavingHand, PersonRemove, Wc, Medication, GroupWork, SentimentNeutral, SentimentVeryDissatisfied, Diversity_2, FrontHand, CrueltyFree, Man, PsychologyAlt, MedicalInformation, Coronavirus, AddReaction, Rocket, Female, PottedPlant, EmojiNature, Rainy, PersonOff, Woman, Cookie, ConnectWithoutContact, Male, MoodBad, Bedtime, SolarPower, Thunderstorm, Communication, Groups_2, PartlyCloudyDay, ThumbsUpDown, Cloudy, EmojiFlags, Masks, Hive, HeartBroken, SentimentExtremelyDissatisfied, ClearDay, Boy, Whatshot, CloudySnowing, EmojiFoodBeverage, WindPower, EmojiTransportation, Elderly, Face_6, ReduceCapacity, Sick, PregnantWoman, Face_3, Bloodtype, GroupRemove, Egg, MedicationLiquid, Groups_3, Co2, ClearNight, Weight, FollowTheSigns, Skull, Face_4, OilBarrel, Transgender, ElderlyWoman, CleanHands, Sanitizer, Person_2, BringYourOwnIp, PublicOff, Face_2, SocialDistance, Routine, SignLanguage, SouthAmerica, SunnySnowing, EmojiSymbols, GardenCart, Flood, Face_5, EggAlt, Cyclone, Girl, Person_4, Dentistry, Tsunami, GroupOff, OutdoorGarden, PartlyCloudyNight, SevereCold, Snowing, Person_3, Tornado, VapingRooms, Landslide, Foggy, SafetyDivider, Woman_2, NoAdultContent, Volcano, Man_2, Blind, '18UpRating': TenUpRating, '6FtApart': SixFtApart, VapeFree, NotAccessible, Man_4, Radiology, RibCage, HandBones, BedtimeOff, Rheumatology, Man_3, Orthopedics, Tibia, Skeleton, Humerus, Agender, Femur, FootBones, TibiaAlt, FemurAlt, HumerusAlt, UlnaRadius, Diversity_4, UlnaRadiusAlt, SpecificGravity, PartnerExchange, Breastfeeding, Cognition, Eyeglasses, Psychiatry, Footprint, Labs, Demography, Neurology, SocialLeaderboard, VitalSigns, Nutrition, GlobeAsia, ClinicalNotes, Conditions, LabResearch, Stethoscope, SentimentExcited, Altitude, HomeHealth, Taunt, RecentPatient, SentimentStressed, GlobeUk, SentimentSad, Helicopter, DewPoint, SentimentCalm, Wrist, Glucose, PrayerTimes, SentimentContent, ShareOff, Pill, SentimentFrustrated, Cardiology, Metabolism, StethoscopeCheck, Ent, Microbiology, BodySystem, Deceased, Explosion, Falling, Infrared, OxygenSaturation, Prescriptions, WeatherHail, Barefoot, Cheer, Earthquake, Genetics, HumidityPercentage, Ophthalmology, Pulmonology, SentimentWorried, StethoscopeArrow, CookieOff, Gynecology, Oncology, ShortStay, WaterLux, WaterVoc, Allergies, Dermatology, Emoticon, Endocrinology, Hematology, Inpatient, MixtureMed, OralDisease, Ward, WaterOrp, Allergy, BodyFat, Congenital, Immunology, LabPanel, MedicalMask, MovingBeds, Nephrology, Outpatient, OutpatientMed, Pediatrics, Salinity, Surgical, Symptoms, Syringe, Urology, WaterDo, WaterPh, WeatherMix, WoundsInjuries, AdminMeds, Fluid, FluidBalance, FluidMed, Gastroenterology, PillOff, Procedure, RespiratoryRate, TotalDissolvedSolids, WaterBottle, FoldedHands, Mist, RainyHeavy, RainyLight, RainySnow, SnowingHeavy, WaterBottleLarge, WaterEc, AccountCircle, Info, Visibility, CalendarMonth, Schedule, Help, Language, Warning, Lock, Error, VisibilityOff, Verified, ManageAccounts, TaskAlt, History, Event, Bookmark, CalendarToday, TipsAndUpdates, QuestionMark, Lightbulb, Fingerprint, Category, Update, LockOpen, PriorityHigh, Code, Build, DateRange, SupervisorAccount, UploadFile, EventAvailable, AdsClick, Today, TouchApp, SettingsSuggest, Pending, Preview, Stars, NewReleases, AccountBox, Celebration, HowToReg, Translate, BugReport, PushPin, Alarm, EditCalendar, EditSquare, Label, EventNote, Extension, RateReview, RecordVoiceOver, Web, HourglassEmpty, PublishedWithChanges, Support, NotificationImportant, HelpCenter, Upload, AccessibilityNew, Bookmarks, PanToolAlt, SupervisedUserCircle, CollectionsBookmark, Dangerous, Interests, AllInclusive, Rule, ChangeHistory, Priority, EventUpcoming, BuildCircle, Wysiwyg, PanTool, Api, CircleNotifications, HotelClass, ManageHistory, WebAsset, Accessible, Upgrade, LockReset, BookmarkAdd, Input, EventBusy, FlutterDash, MoreTime, SaveAs, ModelTraining, Backup, Accessibility, AlarmOn, DynamicFeed, Pageview, HomeAppLogo, PermContactCalendar, LabelImportant, HistoryToggleOff, SquareFoot, Approval, More, Swipe, Assistant, ComponentExchange, EventRepeat, BookmarkAdded, AppShortcut, OpenInBrowser, Unpublished, OfflineBolt, NotificationAdd, NoAccounts, FreeCancellation, BackgroundReplace, RunningWithErrors, Webhook, Anchor, HourglassFull, '3dRotation': ThreeDRotation, LockPerson, NewLabel, LockClock, AutoDelete, AccessibleForward, AddAlert, DomainVerification, SmartButton, Outbound, HandGesture, Tab, SettingsPower, ChromeReaderMode, OnlinePrediction, Gesture, GeneratingTokens, EditNotifications, LightbulbCircle, FindReplace, BackupTable, OfflinePin, WifiProtectedSetup, AdUnits, Http, BookmarkRemove, AlarmAdd, PinchZoomOut, OnDeviceTraining, Snooze, CodeOff, BatchPrediction, PinchZoomIn, Commit, HourglassDisabled, SettingsOverscan, Polymer, LogoDev, YoutubeActivity, TimeAuto, PersonAddDisabled, VoiceOverOff, AlarmOff, UpdateDisabled, Timer_10Alt_1, RoundedCorner, LabelOff, AllOut, Timer_3Alt_1, TabUnselected, Rsvp, WebAssetOff, PinInvoke, PinEnd, CodeBlocks, ApprovalDelegation, ArrowSelectorTool, Problem, VisibilityLock, AwardStar, AutoLabel, SettingsAccountBox, ReleaseAlert, DraftOrders, PanZoom, AccountCircleOff, WatchScreentime, BookmarkManager, Shift, AdOff, AlarmSmartWake, HelpClinic, DomainVerificationOff, LockOpenRight, MeasuringTape, PreviewOff, SupervisedUserCircleOff, GestureSelect, ShiftLock, WaterLock, WarningOff, Mail, Call, Notifications, Send, Chat, Link, Forum, Inventory_2, PhoneInTalk, ContactSupport, ChatBubble, NotificationsActive, AlternateEmail, Sms, Comment, PowerSettingsNew, Hub, PersonSearch, ImportContacts, ContactMail, Contacts, LiveHelp, ForwardToInbox, MarkEmailUnread, Lan, Reviews, ContactPhone, ModeComment, HourglassTop, Inbox, OutgoingMail, Drafts, HourglassBottom, MarkEmailRead, SmsFailed, LinkOff, CalendarAddOn, PhoneEnabled, AddComment, SpeakerNotes, PermPhoneMsg, CoPresent, CallEnd, Topic, NotificationsOff, CellTower, MarkChatUnread, ScheduleSend, Dialpad, CallMade, SatelliteAlt, MarkUnreadChatAlt, Unarchive, '3p': ThreeP, CancelPresentation, MarkAsUnread, MoveToInbox, AttachEmail, PhonelinkRing, NextPlan, Unsubscribe, PhoneCallback, CallReceived, SettingsPhone, CallSplit, PresentToAll, AddCall, MarkunreadMailbox, AllInbox, PhoneForwarded, VoiceChat, MailLock, Attribution, Voicemail, Duo, ContactEmergency, MarkChatRead, Upcoming, PhoneDisabled, Outbox, SwapCalls, PhonelinkLock, Spoke, CancelScheduleSend, NotificationsPaused, RingVolume, PictureInPictureAlt, Quickreply, PhoneMissed, CommentBank, SendAndArchive, ChatAddOn, SettingsBluetooth, PhonelinkErase, PictureInPicture, CommentsDisabled, VideoChat, Score, PausePresentation, SpeakerPhone, CellWifi, SpeakerNotesOff, AutoReadPlay, Mms, CallMerge, PlayForWork, CallMissedOutgoing, WifiChannel, CallMissed, CalendarAppsScript, PhonePaused, Rtt, AutoReadPause, PhoneLocked, WifiCalling, DialerSip, Nat, ChatAppsScript, Sip, PhoneBluetoothSpeaker, E911Avatar, InboxCustomize, ChatError, ChatPasteGo, SignalCellularAdd, CallQuality, NetworkIntelligenceHistory, NetworkManage, PhonelinkRingOff, WifiAdd, WifiProxy, CallLog, NetworkIntelligenceUpdate, Edit, PhotoCamera, FilterAlt, Image, NavigateNext, Tune, Timer, PictureAsPdf, Circle, Palette, AutoAwesome, AddAPhoto, MagicButton, PhotoLibrary, NavigateBefore, AutoStories, AddPhotoAlternate, Brush, Imagesmode, Nature, FlashOn, WbSunny, Camera, Straighten, LooksOne, Landscape, Timelapse, Slideshow, GridOn, RotateRight, CropSquare, Adjust, Style, CropFree, AspectRatio, Brightness_6, Photo, NaturePeople, FilterVintage, ImageSearch, Crop, MovieFilter, BlurOn, CenterFocusStrong, Contrast, FaceRetouchingNatural, Compare, LooksTwo, RotateLeft, Colorize, Flare, FilterNone, WbIncandescent, FilterDrama, Healing, Looks_3, WbTwilight, Brightness_5, InvertColors, Lens, Animation, Opacity, IncompleteCircle, BrokenImage, FilterCenterFocus, AddToPhotos, Brightness_4, Flip, FlashOff, CenterFocusWeak, AutoAwesomeMotion, MicExternalOn, FlipCameraAndroid, LensBlur, Details, Grain, NoPhotography, ImageNotSupported, Panorama, WebStories, Dehaze, GifBox, Flaky, Loupe, ExposurePlus_1, SettingsBrightness, Texture, AutoAwesomeMosaic, Looks_4, Filter_1, TimerOff, FlipCameraIos, CameraEnhance, PanoramaFishEye, ViewCompact, Filter, Brightness_1, PhotoCameraFront, ControlPointDuplicate, PhotoAlbum, Brightness_7, Transform, LinkedCamera, ViewComfy, Crop_16_9, Looks, HideImage, Looks_5, Exposure, PhotoFilter, Rotate_90DegreesCcw, FilterHdr, Brightness_3, Gif, HdrStrong, LeakAdd, Crop_7_5, Gradient, Vrpano, CropPortrait, CameraRoll, HdrAuto, BlurCircular, MotionPhotosAuto, Rotate_90DegreesCw, Brightness_2, PhotoSizeSelectSmall, ShutterSpeed, Looks_6, CameraFront, FlashAuto, Filter_2, CropLandscape, FilterTiltShift, Deblur, MonochromePhotos, AstrophotographyAuto, NightSightAuto, Crop_5_4, HdrWeak, Filter_4, Filter_3, MotionPhotosPaused, CropRotate, Crop_3_2, Tonality, SwitchCamera, PhotoFrame, ExposureZero, MacroOff, PhotoSizeSelectLarge, Fluorescent, EvShadow, FilterFrames, PartyMode, RawOn, MotionBlur, ExposurePlus_2, PhotoCameraBack, BlurLinear, ExposureNeg_1, WbIridescent, FilterBAndW, MotionPhotosOff, PanoramaHorizontal, SwitchVideo, Filter_5, BlurMedium, InvertColorsOff, FaceRetouchingOff, Filter_7, PanoramaPhotosphere, BurstMode, HdrOn, AutoFix, GridOff, Filter_9Plus, Filter_8, BlurShort, Timer_10, Filter_9, DirtyLens, WbShade, NoFlash, Filter_6, TrailLength, ImageAspectRatio, ExposureNeg_2, Vignette, Timer_3, LeakRemove, '60fpsSelect': SixtyFpsSelect, BlurOff, '30fpsSelect': ThirtyFpsSelect, PermCameraMic, MicExternalOff, TrailLengthMedium, CameraRear, PanoramaVertical, TrailLengthShort, AutoFixHigh, NightSightAutoOff, AutofpsSelect, PanoramaWideAngle, Mp, HdrOff, HdrOnSelect, '24mp': TwentyFourMP, HdrEnhancedSelect, AutoFixNormal, '22mp': TwentyTwoMP, AstrophotographyOff, '10mp': TenMP, '12mp': TwelveMP, '18mp': EighteenMP, WbAuto, HdrAutoSelect, RawOff, '9mp': NineMP, HdrPlus, '13mp': ThirteenMP, '20mp': TwentyMP, '5mp': FiveMP, '7mp': SevenMP, '15mp': FifteenMP, HdrOffSelect, Hevc, '16mp': SixteenMP, '19mp': NineteenMP, '14mp': FourteenMP, '23mp': TwentyThreeMP, '2mp': TwoMP, '8mp': EightMP, '3mp': ThreeMP, '6mp': SixMP, '11mp': ElevenMP, '21mp': TwentyOneMP, '17mp': SeventeenMP, '4mp': FourMP, GalleryThumbnail, AutoFixOff, SettingsPanorama, SettingsPhotoCamera, MotionMode, SettingsMotionMode, SettingsNightSight, BackgroundDotLarge, SettingsVideoCamera, '50mp': FiftyMP, SettingsTimelapse, BackgroundGridSmall, MacroAuto, SettingsBRoll, HighDensity, LowDensity, SettingsCinematicBlur, SettingsSlowMotion, ShoppingCart, Payments, ShoppingBag, Monitoring, CreditCard, ReceiptLong, AttachMoney, Storefront, Sell, TrendingUp, Database, AccountBalance, Work, Paid, AccountBalanceWallet, Analytics, Insights, QueryStats, Store, Savings, MonetizationOn, Calculate, QrCodeScanner, BarChart, AddShoppingCart, AccountTree, Receipt, Redeem, CurrencyExchange, TrendingFlat, ShoppingBasket, QrCode_2, Domain, QrCode, PrecisionManufacturing, Leaderboard, CorporateFare, Timeline, CurrencyRupee, InsertChart, Wallet, ShowChart, Euro, WorkHistory, MeetingRoom, CreditScore, BarcodeScanner, PieChart, Loyalty, Copyright, Barcode, ConversionPath, TrackChanges, AutoGraph, TrendingDown, PriceCheck, EuroSymbol, Schema, AddBusiness, AddCard, CardMembership, CurrencyBitcoin, PriceChange, ProductionQuantityLimits, DonutLarge, Tenancy, DataExploration, BubbleChart, DonutSmall, Contactless, Money, StackedLineChart, StackedBarChart, Toll, MoneyOff, Cases, CurrencyYen, CurrencyPound, AreaChart, Atr, RemoveShoppingCart, RoomPreferences, AddChart, Shop, DomainAdd, CardTravel, GroupedBarChart, LegendToggle, ScatterPlot, CreditCardOff, SsidChart, Mediation, CandlestickChart, WaterfallChart, CurrencyRuble, FullStackedBarChart, DomainDisabled, StrikethroughS, ShopTwo, NextWeek, Atm, MultilineChart, CurrencyLira, CurrencyYuan, NoMeetingRoom, CurrencyFranc, Autopay, ContactlessOff, BarChart_4Bars, ChartData, FamilyHistory, OrderApprove, Podium, Flowsheet, ConveyorBelt, AutoMeetingRoom, Forklift, FrontLoader, InactiveOrder, QrCode_2Add, Pallet, BarcodeReader, ConversionPathOff, OrderPlay, Trolley, WorkAlert, WorkUpdate, PinDrop, LocationOn, Map, HomePin, Explore, Restaurant, Flag, MyLocation, LocalFireDepartment, PersonPinCircle, LocalMall, NearMe, WhereToVote, BusinessCenter, East, RestaurantMenu, Handyman, Factory, LocalLibrary, HomeWork, MedicalServices, Layers, LocalActivity, ShareLocation, Emergency, NorthEast, AddLocation, Fastfood, Warehouse, Navigation, PersonPin, LocalParking, HomeRepairService, LocalHospital, South, LocalPolice, ZoomOutMap, LocationSearching, LocalFlorist, LocationAway, CrisisAlert, West, LocalGasStation, Park, MapsUgc, CleaningServices, LocalAtm, Package, '360': ThreeHundredAndSixty, ElectricalServices, North, FlagCircle, AddLocationAlt, Directions, FmdBad, TheaterComedy, LocalDrink, LocationHome, LocalPizza, NotListedLocation, LocalPostOffice, WineBar, Beenhere, LocalConvenienceStore, Signpost, AltRoute, LocationAutomation, Tour, Church, TripOrigin, Traffic, LocalLaundryService, SafetyCheck, EvStation, TakeoutDining, Moving, ZoomInMap, SoupKitchen, Stadium, TransferWithinAStation, LocationOff, PestControl, ConnectingAirports, MultipleStop, WrongLocation, EditLocation, Plumbing, ModeOfTravel, MinorCrash, SouthEast, LocalPharmacy, AddRoad, FireTruck, Castle, DryCleaning, SetMeal, BabyChangingStation, LayersClear, Mosque, EditLocationAlt, NorthWest, LocalCarWash, EditAttributes, RunCircle, TransitEnterexit, Sos, Satellite, EditRoad, SouthWest, AddHome, Streetview, KebabDining, AirlineStops, FireHydrant, LocalSee, AssistWalker, AddHomeWork, FlightClass, RemoveRoad, NoMeals, Synagogue, Fort, TempleBuddhist, LocationDisabled, CompassCalibration, TempleHindu, ExploreOff, PestControlRodent, NearMeDisabled, DirectionsAlt, Pergola, DirectionsOff, DirectionsAltOff, MoveLocation, MovingMinistry, Move, Description, ContentCopy, Dashboard, EditNote, MenuBook, GridView, List, Folder, ListAlt, Inventory, FolderOpen, Article, FactCheck, AttachFile, FormatListBulleted, Assignment, Task, Checklist, CloudUpload, Draft, Summarize, Feed, Draw, Cloud, Newspaper, FileCopy, ViewList, NoteAdd, BorderColor, Book, HistoryEdu, DesignServices, PendingActions, FormatQuote, PostAdd, RequestQuote, CloudDownload, DragHandle, ContactPage, Table, SpaceDashboard, Archive, ContentPaste, Percent, Attachment, AssignmentInd, FormatListNumbered, AssignmentTurnedIn, Tag, TableChart, StickyNote_2, DashboardCustomize, TextFields, Reorder, FormatBold, IntegrationInstructions, FindInPage, Note, TextSnippet, DocumentScanner, ChecklistRtl, NoteAlt, EditDocument, CloudSync, TableRows, PermMedia, CloudDone, Title, TableView, ContentCut, Cut, DataObject, Notes, Subject, Functions, FormatItalic, ContentPasteSearch, FormatColorFill, FolderShared, Plagiarism, HorizontalRule, FilePresent, FolderCopy, FormatAlignLeft, Ballot, TeamDashboard, FormatPaint, AddLink, CloudOff, ViewColumn, ReadMore, Difference, ViewAgenda, FormatSize, FormatUnderlined, VerticalAlignTop, Toc, Height, VerticalAlignBottom, CopyAll, DriveFolderUpload, ViewWeek, FormatColorText, AssignmentLate, ViewModule, DriveFileMove, LowPriority, AssignmentReturn, FormatAlignCenter, FolderSpecial, Segment, CalendarViewMonth, Polyline, FolderZip, Square, BreakingNewsAlt_1, FormatAlignRight, Grading, ViewHeadline, LinearScale, ViewQuilt, EditOff, ViewCarousel, TextIncrease, RequestPage, ViewSidebar, Pages, TextFormat, FormatAlignJustify, CalendarViewWeek, Hexagon, Numbers, DocsAddOn, FolderDelete, FormatShapes, FormsAddOn, ImagesearchRoller, JoinFull, CalendarViewDay, VideoFile, CloudQueue, FontDownload, FormatListNumberedRtl, JoinInner, AddToDrive, ContentPasteGo, RestorePage, Rectangle, VerticalSplit, FormatColorReset, RuleFolder, ViewStream, CloudCircle, FormatIndentIncrease, Spellcheck, AssignmentReturned, DataArray, AlignHorizontalLeft, TextDecrease, PivotTableChart, Deselect, VerticalAlignCenter, Pentagon, MergeType, SpaceBar, FormatStrikethrough, ViewDay, FlipToFront, JoinLeft, BorderAll, ShortText, ShapeLine, FormatLineSpacing, LineWeight, HorizontalSplit, FormatIndentDecrease, AlignHorizontalCenter, JoinRight, SnippetFolder, SubtitlesOff, AlignVerticalBottom, FolderOff, AlignHorizontalRight, Glyphs, FormatClear, Function, InsertPageBreak, VerticalDistribute, ContentPasteOff, Superscript, HorizontalDistribute, LineAxis, LineStyle, FlipToBack, AlignVerticalCenter, AlignVerticalTop, Margin, Clarify, WrapText, ViewArray, Subscript, BorderClear, BorderStyle, BorderOuter, AmpStories, TypeSpecimen, TextRotateVertical, Padding, FormsAppsScript, BorderVertical, TextRotationNone, FormatTextdirectionLToR, FormatOverline, DocsAppsScript, BorderHorizontal, FontDownloadOff, FormatTextdirectionRToL, TextRotationAngleup, BorderBottom, TextRotationDown, BorderTop, BorderLeft, TextRotationAngledown, BorderInner, TextRotateUp, BorderRight, AssignmentAdd, FinanceChip, FormatH1, ViewColumn_2, Counter_1, Join, FormatUnderlinedSquiggle, Overview, SlideLibrary, FormatH2, FormatParagraph, FormatImageLeft, FormatListBulletedAdd, Variables, FormatH3, FormatImageRight, FrameInspect, FormatH5, FormatH6, FormatH4, Counter_2, ProcessChart, VotingChip, LocationChip, Equal, LabProfile, FormatInkHighlighter, Counter_3, Signature, ExportNotes, FrameSource, AddNotes, CellMerge, Shapes, BusinessChip, Counter_4, SourceNotes, TableChartView, TextSelectMoveForwardCharacter, UnknownDocument, Diagnosis, ListAltAdd, DecimalIncrease, FormatLetterSpacingStandard, InsertText, StylusLaserPointer, TableRowsNarrow, GridGuides, LineEndArrowNotch, RegularExpression, ResetImage, ScanDelete, Counter_5, LineStart, Width, FormatLetterSpacing, FormatLetterSpacing_2, FormatTextOverflow, LineEnd, Ungroup, LineEndSquare, MatchCase, Scan, DrawCollage, FormatLetterSpacingWide, FormatLetterSpacingWider, SmbShare, TabClose, AlignJustifySpaceBetween, Counter_6, LanguageChineseQuick, LineEndArrow, OtherAdmission, StrokeFull, AlignJustifySpaceAround, DrawAbstract, FolderManaged, FolderSupervised, FormatTextClip, LanguageInternational, LanguageSpanish, LineEndCircle, LineEndDiamond, LineStartCircle, SheetsRtl, TabMove, TabNewRight, TextSelectJumpToBeginning, TextSelectStart, TopPanelOpen, AlignJustifySpaceEven, AlignSpaceBetween, AttachFileAdd, Counter_8, FlexDirection, FrameReload, HeapSnapshotMultiple, HeapSnapshotThumbnail, LanguageChineseDayi, LanguageGbEnglish, LineCurve, LineStartSquare, MatchWord, Select, SpecialCharacter, TabDuplicate, TabGroup, TextSelectMoveForwardWord, ThumbnailBar, TopPanelClose, AlignJustifyCenter, AlignJustifyFlexEnd, AlignJustifyFlexStart, AlignSpaceAround, AlignSpaceEven, Counter_7, FitPage, FitWidth, FormatTextWrap, HeapSnapshotLarge, HighlighterSize_4, LanguageChinesePinyin, LanguageChineseWubi, LanguageKoreanLatin, LanguageUs, LineStartArrow, LineStartArrowNotch, LineStartDiamond, PenSize_2, PenSize_5, PersonBook, StrokePartial, TabCloseRight, TextSelectEnd, TextSelectJumpToEnd, TextSelectMoveDown, TextSelectMoveUp, AlignCenter, AlignEnd, AlignFlexCenter, AlignFlexEnd, AlignFlexStart, AlignItemsStretch, AlignJustifyStretch, AlignSelfStretch, AlignStart, AlignStretch, Counter_0, Counter_9, DecimalDecrease, FlexNoWrap, FlexWrap, HighlighterSize_1, HighlighterSize_2, HighlighterSize_3, HighlighterSize_5, LanguageChineseArray, LanguageChineseCangjie, LanguageFrench, LanguagePinyin, LanguageUsColemak, LanguageUsDvorak, LetterSwitch, PenSize_1, PenSize_3, PenSize_4, TabRecent, TextSelectMoveBackCharacter, TextSelectMoveBackWord, PlayArrow, PlayCircle, Mic, Videocam, VolumeUp, Pause, MusicNote, LibraryBooks, Movie, SkipNext, Speed, Replay, VolumeOff, ViewInAr, PauseCircle, FiberManualRecord, SkipPrevious, StopCircle, Stop, Equalizer, Subscriptions, VideoLibrary, FastForward, PlaylistAdd, VideoCall, Repeat, VolumeMute, Shuffle, MicOff, LibraryMusic, Hearing, Podcasts, PlaylistAddCheck, FastRewind, SoundDetectionDogBarking, QueueMusic, VideoCameraFront, Subtitles, VolumeDown, PlayPause, Album, Radio, DiscoverTune, AvTimer, LibraryAddCheck, VideocamOff, ClosedCaption, Stream, Forward_10, NotStarted, PlaylistPlay, Replay_10, FiberNew, BrandingWatermark, RecentActors, TextToSpeech, PlaylistRemove, InterpreterMode, SlowMotionVideo, FramePerson, PlaylistAddCheckCircle, SettingsVoice, VideoSettings, FeaturedPlayList, AudioFile, SoundDetectionLoudSound, Lyrics, PlayLesson, Hd, RepeatOne, CallToAction, AddToQueue, HighQuality, MusicOff, VideoCameraBack, SpatialAudioOff, ShuffleOn, PlaylistAddCircle, VolumeDownAlt, HearingDisabled, FeaturedVideo, Replay_5, RepeatOn, QueuePlayNext, SpatialAudio, ArtTrack, Explicit, Airplay, SpeechToText, Forward_5, Forward_30, '4k': FourK, MusicVideo, Replay_30, SpatialTracking, ControlCamera, ClosedCaptionDisabled, DigitalOutOfHome, VideoLabel, FiberSmartRecord, PlayDisabled, RepeatOneOn, BroadcastOnPersonal, Sd, MissedVideoCall, SurroundSound, '10k': TenK, FiberPin, '60fps': SixtyFPS, SoundDetectionGlassBreak, RemoveFromQueue, BroadcastOnHome, FiberDvr, '30fps': ThirtyFPS, '4kPlus': FourKPlus, VideoStable, '8k': EightK, '1k': OneK, Privacy, '8kPlus': EightKPlus, '2k': TwoK, '7k': SevenK, '1kPlus': OneKPlus, '9k': NineK, '9kPlus': NineKPlus, '5k': FiveK, '2kPlus': TwoKPlus, '5kPlus': FiveKPlus, '6k': SixK, '6kPlus': SixKPlus, '3k': ThreeK, '7kPlus': SeevenKPlus, '3kPlus': ThreeKPlus, AutoDetectVoice, CinematicBlur, MediaLink, Autoplay, VideoCameraFrontOff, ForwardMedia, MovieEdit, Resume, AutoVideocam, SelectToSpeak, Autopause, Autostop, ForwardCircle, ViewInArOff, SoundSampler, FramePersonOff, LocalShipping, DirectionsCar, Flight, DirectionsRun, DirectionsWalk, FlightTakeoff, DirectionsBus, DirectionsBike, Train, AirportShuttle, PedalBike, DirectionsBoat, TwoWheeler, Agriculture, LocalTaxi, Sailing, ElectricCar, FlightLand, Hail, NoCrash, Commute, Motorcycle, CarCrash, Tram, DepartureBoard, Subway, ElectricMoped, TurnRight, ElectricScooter, ForkRight, DirectionsSubway, TireRepair, ElectricBike, RvHookup, BusAlert, TurnLeft, Transportation, Airlines, TaxiAlert, UTurnLeft, DirectionsRailway, ElectricRickshaw, TurnSlightRight, UTurnRight, ForkLeft, RailwayAlert, BikeScooter, TurnSharpRight, TurnSlightLeft, NoTransfer, Snowmobile, TurnSharpLeft, Ambulance, School, Campaign, Construction, Engineering, VolunteerActivism, Science, SportsEsports, ConfirmationNumber, RealEstateAgent, Cake, SelfImprovement, SportsSoccer, Air, Biotech, Water, Hiking, Architecture, SportsScore, PersonalInjury, SportsBasketball, Waves, Theaters, SportsTennis, SwitchAccount, NightsStay, SportsGymnastics, Backpack, SportsMotorsports, HowToVote, SportsKabaddi, Surfing, Piano, Sports, Toys, SportsVolleyball, SportsMartialArts, SportsBaseball, Camping, DownhillSkiing, Swords, Kayaking, Scoreboard, Phishing, SportsHandball, SportsFootball, Skateboarding, SportsGolf, ToysFan, SportsCricket, NordicWalking, Kitesurfing, RollerSkating, Rowing, ScubaDiving, Storm, SportsMma, Paragliding, Snowboarding, SportsHockey, IceSkating, Snowshoeing, SportsRugby, Sledding, PianoOff, NoBackpack, CakeAdd, HealthMetrics, Mindfulness, Sprint, Sleep, StressManagement, Exercise, Relax, Steps, EcgHeart, ReadinessScore, Laps, MenstrualHealth, Distance, AvgTime, Azm, Floor, PersonPlay, Onsen, Podiatry, Pace, BathOutdoor, PersonCelebrate, Bia, Fertile, AvgPace, Eda, Spo2, InteractiveSpace, WaterFull, WaterMedium, Elevation, GlassCup, PlayShapes, Sauna, SleepScore, WaterLoss, BathPrivate, HrResting, MonitorWeightGain, BathPublicLarge, CheckInOut, MonitorWeightLoss, ThermometerLoss, PhysicalTherapy, ThermometerGain, PhoneIphone, Save, Smartphone, Print, KeyboardArrowDown, Computer, Devices, DesktopWindows, SmartDisplay, Dns, KeyboardBackspace, Headphones, SmartToy, PhoneAndroid, KeyboardArrowRight, Memory, LiveTv, Keyboard, LaptopMac, HeadsetMic, KeyboardArrowUp, Tv, DeviceThermostat, Mouse, Balance, Route, PointOfSale, KeyboardArrowLeft, LaptopChromebook, KeyboardReturn, Power, Watch, LaptopWindows, Router, DeveloperBoard, DisplaySettings, Scale, BookOnline, Fax, DeveloperMode, Cast, CastForEducation, VideogameAsset, DeviceHub, Straight, ScreenSearchDesktop, DesktopMac, SettingsEthernet, SettingsInputAntenna, MobileFriendly, Monitor, ImportantDevices, TabletMac, DevicesOther, SendToMobile, SystemUpdate, SettingsRemote, MonitorWeight, ScreenRotation, ScreenShare, KeyboardAlt, SettingsInputComponent, Speaker, Merge, SimCard, KeyboardTab, Vibration, PowerOff, ConnectedTv, ScreenshotMonitor, RememberMe, Tablet, BrowserUpdated, SecurityUpdateGood, SdCard, CastConnected, DeviceUnknown, TabletAndroid, ChargingStation, PhonelinkSetup, PunchClock, Scanner, Screenshot, SettingsInputHdmi, StayCurrentPortrait, TapAndPlay, KeyboardHide, PrintDisabled, SecurityUpdateWarning, DiscFull, AppBlocking, KeyboardCapslock, SpeakerGroup, MobileScreenShare, Aod, SdCardAlert, Tty, LiftToTalk, AddToHomeScreen, Earbuds, PermDeviceInformation, StopScreenShare, MobileOff, HeadsetOff, DesktopAccessDisabled, ResetTv, OfflineShare, AdfScanner, HeadphonesBattery, ScreenLockPortrait, RoundaboutRight, Dock, SettopComponent, SettingsInputSvideo, WatchOff, SmartScreen, StayCurrentLandscape, ChromecastDevice, SettingsCell, EarbudsBattery, HomeMax, PowerInput, NoSim, ScreenLockLandscape, RampRight, DeveloperBoardOff, RoundaboutLeft, StayPrimaryPortrait, StayPrimaryLandscape, TvOff, HomeMini, PhonelinkOff, RampLeft, ScreenLockRotation, VideogameAssetOff, AodTablet, Gamepad, Robot, RearCamera, DevicesWearables, AmbientScreen, AodWatch, Ecg, HardDrive, NightSightMax, Pacemaker, DevicesOff, Joystick, MemoryAlt, ScreenshotTablet, StreamApps, TouchpadMouse, HardDrive_2, WatchWake, CameraVideo, Deskphone, Lda, CastPause, CastWarning, PrintAdd, PrintConnect, PrintError, PrintLock, Ventilator, WatchButtonPress, DarkMode, LightMode, Wifi, SignalCellularAlt, Password, Widgets, Pin, Storage, RssFeed, Android, BatteryFull, WifiOff, Bluetooth, BatteryChargingFull, Dvr, Thermostat, GraphicEq, Nightlight, Battery_5Bar, SignalWifi_4Bar, GppMaybe, Cable, GppBad, DataUsage, Battery_4Bar, SignalCellular_4Bar, BatteryFullAlt, AirplanemodeActive, Radar, Battery_0Bar, Cameraswitch, Wallpaper, SignalDisconnected, FlashlightOn, NetworkCheck, Battery_6Bar, Charger, WifiTethering, SimCardDownload, Usb, QuickPhrases, Splitscreen, Battery_3Bar, Battery_1Bar, Adb, NetworkWifi_3Bar, BatteryLow, BatteryAlert, BluetoothSearching, NetworkWifi, BluetoothConnected, WifiFind, '5g': FiveG, Battery_2Bar, BrightnessHigh, NetworkCell, Nfc, Pattern, DataSaverOn, SignalWifiStatusbarNotConnected, BluetoothDisabled, SignalWifiBad, SignalCellular_3Bar, NoiseControlOff, NetworkWifi_2Bar, NetworkWifi_1Bar, SignalWifiOff, BrightnessMedium, ModeStandby, BrightnessLow, BatteryVeryLow, SignalWifi_0Bar, MobiledataOff, BatteryCharging_20, BatteryCharging_80, Grid_4x4, BatterySaver, BatteryCharging_90, FlashlightOff, SignalWifiStatusbarNull, SettingsSystemDaydream, BatteryCharging_50, BatteryUnknown, SignalCellular_2Bar, ScreenRotationAlt, WifiCalling_3, BadgeCriticalBattery, SignalCellular_1Bar, '4gMobiledata': FourGMobileData, NoiseAware, BatteryCharging_60, DoNotDisturbOnTotalSilence, NearbyError, WifiLock, SignalCellularConnectedNoInternet_0Bar, Battery_20, SignalCellular_0Bar, BatteryCharging_30, NetworkPing, SignalCellularConnectedNoInternet_4Bar, BrightnessAuto, WifiCalling_1, WifiTetheringError, EdgesensorHigh, Wifi_2Bar, Battery_30, Battery_50, AirplanemodeInactive, Grid_3x3, LteMobiledata, PermDataSetting, '1xMobiledata': OneXMobileData, SignalCellularAlt_2Bar, SignalCellularNodata, Battery_60, BluetoothDrive, PermScanWifi, DevicesFold, Battery_90, WifiCalling_2, '4gPlusMobiledata': FourGPlusMobileData, MediaBluetoothOn, NetworkLocked, SignalCellularOff, Battery_80, Timer_10Select, WifiTetheringOff, SignalCellularAlt_1Bar, EdgesensorLow, UsbOff, Wifi_1Bar, '3gMobiledata': ThreeGMobileData, ApkInstall, SignalCellularNull, LtePlusMobiledata, GridGoldenratio, GMobiledata, PortableWifiOff, NoiseControlOn, MediaBluetoothOff, Timer_3Select, EMobiledata, ApkDocument, NearbyOff, HMobiledata, RMobiledata, HPlusMobiledata, DualScreen, ScreenshotRegion, Stylus, BatteryStatusGood, DockToLeft, DockToRight, OverviewKey, StylusNote, BrightnessEmpty, KeyboardExternalInput, MagicTether, MagnifyFullscreen, SplitscreenLeft, '1xMobiledataBadge': OneXMobileDataBadge, KeyboardOff, ScreenRecord, DisplayExternalInput, DockToBottom, KeyboardFull, KeyboardKeys, MagnifyDocked, SplitscreenRight, '5gMobiledataBadge': FiveGMobileDataBadge, BacklightLow, BatteryPlus, KeyboardCapslockBadge, KeyboardOnscreen, KeyboardPreviousLanguage, LteMobiledataBadge, LtePlusMobiledataBadge, ScreenshotFrame, ScreenshotKeyboard, WallpaperSlideshow, '3gMobiledataBadge': ThreeGMobileDataBadge, '4gMobiledataBadge': FourGMobileDataBadge, BacklightHigh, BatteryChange, BatteryError, BatteryShare, EMobiledataBadge, EvMobiledataBadge, GMobiledataBadge, Grid3x3Off, HMobiledataBadge, HPlusMobiledataBadge, ScreenRotationUp, SplitscreenBottom, SplitscreenTop, WifiHome, WifiNotification, Badge, VerifiedUser, AdminPanelSettings, Report, Security, VpnKey, Shield, Policy, Exclamation, PrivacyTip, AssuredWorkload, VpnLock, DisabledVisible, E911Emergency, EnhancedEncryption, PrivateConnectivity, VpnKeyOff, AddModerator, NoEncryption, SyncLock, WifiPassword, KeyVisualizer, RemoveModerator, ReportOff, ShieldLock, ShieldPerson, VpnKeyAlert, Apartment, LocationCity, FitnessCenter, LunchDining, Spa, Cottage, LocalCafe, Hotel, FamilyRestroom, BeachAccess, LocalBar, Pool, OtherHouses, Luggage, Liquor, AirplaneTicket, Casino, SportsBar, BakeryDining, RamenDining, Nightlife, LocalDining, HolidayVillage, Icecream, EscalatorWarning, DinnerDining, Museum, FoodBank, NightShelter, Festival, Attractions, GolfCourse, Stairs, Villa, SmokeFree, SmokingRooms, CarRental, AirlineSeatReclineNormal, Elevator, Gite, ChildFriendly, AirlineSeatReclineExtra, BreakfastDining, Carpenter, CarRepair, Cabin, BrunchDining, NoFood, Houseboat, DoNotTouch, RiceBowl, Tapas, WheelchairPickup, Bento, NoDrinks, DoNotStep, Bungalow, AirlineSeatFlat, AirlineSeatIndividualSuite, Escalator, Chalet, NoLuggage, AirlineSeatLegroomExtra, AirlineSeatFlatAngled, AirlineSeatLegroomNormal, AirlineSeatLegroomReduced, NoStroller, House, Bed, AcUnit, Chair, Coffee, ElectricBolt, ChildCare, Sensors, BackHand, Checkroom, EmergencyHome, Grass, Shower, ModeFan, Mop, Kitchen, RoomService, Thermometer, Styler, Yard, Bathtub, KingBed, Roofing, EnergySavingsLeaf, Window, Cooking, Valve, GarageHome, DoorFront, ModeHeat, Light, Foundation, OutdoorGrill, Garage, Dining, TableRestaurant, Deck, SensorOccupied, Weekend, CoffeeMaker, Flatware, HumidityHigh, Highlight, Fireplace, ModeNight, HumidityLow, ElectricMeter, TvGen, HumidityMid, BedroomParent, ChairAlt, Blender, Microwave, Scene, HeatPump, SingleBed, BedroomBaby, OvenGen, Bathroom, InHomeMode, HotTub, ModeOffOn, Hardware, Sprinkler, TableBar, GasMeter, Crib, Soap, Countertops, Living, ModeCool, HomeIotDevice, FireExtinguisher, PropaneTank, Outlet, RemoteGen, SensorDoor, EventSeat, Gate, Matter, Airware, Faucet, DishwasherGen, EnergyProgramSaving, AirFreshener, Balcony, Wash, CameraIndoor, WaterDamage, BedroomChild, HouseSiding, Switch, MicrowaveGen, DetectorSmoke, DoorSliding, Iron, EnergyProgramTimeUsed, Desk, WaterHeater, Umbrella, Dresser, Fence, DoorBack, Doorbell, ModeFanOff, Hvac, CameraOutdoor, Kettle, EmergencyHeat, AirPurifierGen, EmergencyShare, Stroller, GoogleWifi, Curtains, Multicooker, SensorsOff, ShieldMoon, ModeHeatCool, ThermostatAuto, EmergencyRecording, SmartOutlet, Blinds, ControllerGen, RollerShades, Dry, BlindsClosed, RollerShadesClosed, Propane, SensorWindow, ThermostatCarbon, RangeHood, Doorbell_3p, TvWithAssistant, Blanket, VerticalShadesClosed, VerticalShades, CurtainsClosed, ModeHeatOff, ModeCoolOff, TamperDetectionOff, Shelves, StadiaController, TempPreferencesCustom, DoorOpen, PowerRounded, NestEcoLeaf, DeviceReset, NestClockFarsightAnalog, NestRemoteComfortSensor, Laundry, BatteryHoriz_075, ShieldWithHeart, TempPreferencesEco, FamiliarFaceAndZone, ToolsPowerDrill, Airwave, Productivity, BatteryHoriz_050, NestHeatLinkGen_3, NestDisplay, WeatherSnowy, ActivityZone, EvCharger, NestRemote, CleaningBucket, SettingsAlert, NestCamIndoor, ArrowsMoreUp, NestHeatLinkE, HomeStorage, NestMultiRoom, NestSecureAlarm, BatteryHoriz_000, NestCamOutdoor, LightGroup, DetectionAndZone, NestThermostatGen_3, MfgNestYaleLock, ToolsPliersWireStripper, DetectorAlarm, NestCamIqOutdoor, ToolsLadder, EarlyOn, NestClockFarsightDigital, NestCamIq, FloorLamp, NestMini, AutoActivityZone, HomeSpeaker, AutoSchedule, NestHelloDoorbell, HomeMaxDots, NestAudio, NestWifiRouter, HouseWithShield, ZonePersonUrgent, NestDisplayMax, MotionSensorActive, CoolToDry, ShieldWithHouse, NestFarsightWeather, Chromecast_2, BatteryProfile, WindowClosed, HeatPumpBalance, ArmingCountdown, NestFoundSavings, BatteryVert_050, DetectorStatus, SelfCare, ToolsLevel, WindowOpen, NestThermostatZirconiumEu, ArrowsMoreDown, NestTrueRadiant, NestCamWiredStand, ZonePersonAlert, Detector, ClimateMiniSplit, NestDetect, NestWifiMistral, NestWifiPoint, QuietTime, DoorSensor, NestCamFloodlight, NestDoorbellVisitor, NestTag, ToolsInstallationKit, BatteryVert_020, NestConnect, BatteryVert_005, NestThermostatSensorEu, NestThermostatSensor, ToolsPhillips, NestSunblock, NestWifiGale, NestWifiPointVento, NestThermostatEEu, DoorbellChime, DetectorCo, DetectorBattery, ToolsFlatHead, NestWakeOnApproach, NestWakeOnPress, MotionSensorUrgent, MotionSensorAlert, WindowSensor, TableLamp, TamperDetectionOn, NestCamMagnetMount, ZonePersonIdle, QuietTimeActive, NestCamStand, DetectorOffline, NestCamWallMount, WallLamp, NestLocatorTag, MotionSensorIdle, AssistantOnHub, LocatorTag, GTranslate, LauncherAssistantOn, NightlightOff, BloodPressure, KeyboardTabRtl, ContrastRtlOff } = iconComponents;
