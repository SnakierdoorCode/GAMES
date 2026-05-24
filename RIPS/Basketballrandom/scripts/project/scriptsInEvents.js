


const scriptsInEvents = {

	async Crazygames_Event1_Act1(runtime, localVars)
	{
		CallAdsFromC3();
	},

	async Crazygames_Event7_Act1(runtime, localVars)
	{
		GameStartEvent();
	},

	async Crazygames_Event8_Act1(runtime, localVars)
	{
		GameStopEvent();
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

