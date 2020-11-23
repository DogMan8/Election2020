# Election2020
A script for calculating probability of getting the same distribution of 1st numbers from each candidate's votes by Benford's law.

short summary:
sigma	DonaldTrump	JoeBiden
all::Log	-0.59	-0.37
5states::Log	-0.03	3.76
2states::Log	-0.7	0.46
15swings::Log	-2.64	0.5

From all sates: Both votes obey Benford's law appropriately.
From 5 states(GA,NC,PA,NV,AZ): Trump is clean, but Biden is highly frauded. 3.76 means probability of 1/12500.
From 2 states(MI,WI): There is too big errors to determine if there is fraud or not.
From 15 states(AZ,CO,FL,GA,IA,MI,MN,NV,NH,NC,OH,PA,TX,VA,WI): Both vote obeys Benford's law.
Selection of 5 or 2 states were got from the article, selection of 15 states was got from wikipedia.

Usage:
1. Open the data site, whichever you want to scrape.
  AP : https://interactives.ap.org/elections/live-data/production/2020-11-03/us-house/metadata.json
  CNN: https://politics-elex-results.data.api.cnn.io/results/view/2020-county-races-PG-WI.json
  AP is the better mathematically because it has data of other candidates.
2. Type F12 to open console, paste this script. Results will be dumped to the console.
  If you want to manipulate the result, give an object to parameter to get the result, like this.
  var obj = {}; (function(outer_result){ ...this script...})(obj);
3. Copy and paste results to spreadsheet. Comma is the delimiter.

Benford's law: https://en.wikipedia.org/wiki/Benford%27s_law
source article(I'm NOT the author): https://diamond.jp/articles/-/254093
data can be seen: https://digg.com/2020/2020-presidential-electoral-map-trump-biden
table of sigma: https://www.koka.ac.jp/morigiwa/sjs/standard_normal_distribution.htm

Description:
Election obeys Benford's law generally. While it strongly depends on the distribution of 1st numbers of constituency. For example, if all constituencies have 10,000 votes, all 1st numbers will be 4 or 5, because both Trump or Biden will get about 50% votes. This lack of randomness of constituencies causes error from the theory, so I must get rid of this.
Cxx is the pseudo candidates, who get xx% of votes of all constituencies. C100 reflects distribution of 1st numbers from constituency precisely, because both are the same mathematically. And Benford's law is independent on scales mathematically. Therefore I can calculate probability of errors mathematically by scaling C100 value. 
If you want to detailed explanation, let us imagine the case, "a theoretical distribution of numbers". This ideal distribution is independent on scale, because Benford's law is a resident of world of multiples. You can read wiki if you might have any doubt. Then, assume that you put an additional number into this ideal distribution. Then the ideal distribution differs from the theory slightly, and the error reflects where the additional number is; a section which has the additional number has slightly more than theoretical value. This "which section has the number" depends on scales, so error depends on scales strongly.
In this case, we can get precise error distribution from scaling C100. "scale" means "percentage of votes gained" in this case. For example, if a candidate gets exact 50% of votes from all constituencies, it will be C50 exactly. While "percentage of votes gained" has errors also, so we can't get the exact same distribution by using Cxx, but we can get errors distribution from scaling C100 if "percentage of votes gained" is distributed randomly in some range. I assumed "0-100%", "40%-60%" and "45%-55%" for "Log", "Log4060" and "Log4555" respectively.
Errors calculated from votes of each candidate contains above error which is caused by "non-ideal distribution of voters in each constituency"(EC:Errors from constituency=C100ex), but each candidate has errors of "percentage of votes gained"(EP: Error of percentage) which can complement EC. In this case, EC is not zero, so each candidates gets better(more ideal; minus) results from all states.
Trump got minus(more ideal) results from all trial, he is clean.
But Biden got big value in 5 states(GA,NC,PA,NV,AZ).  3.76 means probability of 1/12500, so the distribution of votes is highly frauded. 2.98 is caused by big error of C100ex, not good value of Biden, so this should be omitted. 5.31 CAN'T be got by non-frauded elections.
About 2 states, EC is too big(>2%) to determine if the there is fraud or not.

summary:				
sigma	DonaldTrump	JoeBiden	C100ex	C100sigma
all::Log	-0.59	-0.37	0.55%	0.09%
all::Log4060	-1.56	-1.32	0.62%	0.08%
all::Log4555	-1.2	-1.01	0.62%	0.10%
5states::Log	-0.03	3.76	0.88%	0.27%
5states::Log4060	-0.95	2.98	1.13%	0.26%
5states::Log4555	-0.59	5.31	0.98%	0.18%
2states::Log	-0.7	0.46	2.19%	0.40%
2states::Log4060	-1.71	-0.04	2.39%	0.28%
2states::Log4555	-1.63	0.11	2.35%	0.27%
15swings::Log	-2.64	0.5	0.89%	0.14%
15swings::Log4060	-2.65	0.17	0.93%	0.16%
15swings::Log4555	-3.31	0.91	0.86%	0.11%

details:									
all										
cands	theory	DonaldTrump	JoeBiden	C100	C66	C60	C55	C50	C45	C40	C33	JoJorgensen	HowieHawkins	DonBlankenship	KanyeWest
1	30.10%	29.87%	29.81%	30.49%	29.46%	28.49%	28.20%	28.11%	28.65%	28.49%	29.23%	28.76%	31.01%	30.64%	34.86%
2	17.61%	16.16%	18.09%	16.99%	16.67%	17.25%	17.22%	18.12%	17.38%	17.31%	18.21%	17.99%	18.05%	17.05%	16.61%
3	12.49%	11.95%	12.62%	11.11%	12.56%	12.37%	12.75%	11.85%	13.43%	14.17%	13.33%	13.27%	10.57%	11.85%	12.96%
4	9.69%	9.73%	11.31%	9.93%	9.12%	9.89%	10.79%	11.44%	10.57%	9.83%	9.77%	9.67%	9.77%	7.80%	9.42%
5	7.92%	8.48%	6.75%	8.19%	9.09%	9.22%	8.42%	8.26%	7.74%	8.19%	8.26%	7.84%	7.88%	9.92%	6.71%
6	6.69%	7.16%	6.49%	6.01%	7.26%	7.00%	6.68%	6.10%	6.78%	7.29%	6.17%	6.68%	6.68%	7.13%	5.30%
7	5.80%	5.81%	5.53%	5.85%	6.07%	5.62%	5.59%	6.68%	6.49%	5.17%	5.88%	5.59%	6.51%	5.97%	5.18%
8	5.12%	5.56%	5.20%	6.36%	4.69%	5.40%	5.62%	5.24%	4.59%	4.91%	4.98%	4.79%	5.48%	5.11%	4.36%
9	4.58%	5.27%	4.21%	5.08%	5.08%	4.75%	4.72%	4.21%	4.37%	4.63%	4.18%	5.40%	4.05%	4.53%	4.59%
votes		73792036	79829155	156296400	104197495.8	93777840	85963020	78148200	70333380	62518560	52098747.9	1850737	389904	59901	66309
nof_regions		3113	3113	3113	3113	3113	3113	3113	3113	3113	3113	3112	1751	1038	849
diff::simple	0.00%	0.49%	0.51%	0.60%	0.57%	0.50%	0.56%	0.80%	0.57%	0.61%	0.43%	0.44%	0.56%	0.70%	1.16%
diff::simple::Log::err/C100sigma		-0.59	-0.37	0.57	0.3	-0.47	0.14	2.88	0.32	0.7	-1.32	-1.19	0.11	1.75	7.06
diff::simple::Log::ex		0.57%	0.42%	0.55%	0.55%	0.54%	0.55%	0.54%	0.55%	0.55%	0.55%	0.48%	1.04%	1.51%	1.41%
diff::simple::Log::sigma		0.06%	0.11%	0.09%	0.09%	0.09%	0.09%	0.09%	0.09%	0.08%	0.09%	0.12%	0.28%	0.43%	0.32%
diff::simple::Log::max		0.74%	0.66%	0.78%	0.79%	0.77%	0.82%	0.80%	0.78%	0.77%	0.78%	0.76%	1.75%	2.45%	2.59%
diff::simple::Log::min		0.38%	0.20%	0.36%	0.38%	0.38%	0.37%	0.39%	0.39%	0.37%	0.37%	0.21%	0.45%	0.59%	0.70%
diff::simple::Log4060::err/C100sigma		-1.56	-1.32	-0.32	-0.61	-1.43	-0.78	2.15	-0.59	-0.19	-2.35	-2.21	-0.82	0.93	6.61
diff::simple::Log4060::ex		0.59%	0.41%	0.62%	0.56%	0.54%	0.53%	0.54%	0.50%	0.52%	0.51%	0.50%	0.98%	1.38%	1.38%
diff::simple::Log4060::sigma		0.04%	0.12%	0.08%	0.10%	0.10%	0.08%	0.07%	0.05%	0.07%	0.07%	0.11%	0.24%	0.46%	0.30%
diff::simple::Log4060::max		0.70%	0.69%	0.79%	0.81%	0.81%	0.74%	0.75%	0.63%	0.72%	0.72%	0.80%	1.53%	2.33%	2.10%
diff::simple::Log4060::min		0.52%	0.18%	0.44%	0.40%	0.40%	0.40%	0.40%	0.40%	0.40%	0.39%	0.26%	0.57%	0.66%	0.68%
diff::simple::Log4555::err/C100sigma		-1.2	-1.01	-0.21	-0.44	-1.09	-0.58	1.75	-0.42	-0.1	-1.82	-1.71	-0.6	0.79	5.3
diff::simple::Log4555::ex		0.57%	0.34%	0.62%	0.54%	0.53%	0.57%	0.51%	0.51%	0.48%	0.53%	0.52%	0.84%	1.14%	1.22%
diff::simple::Log4555::sigma		0.03%	0.08%	0.10%	0.11%	0.10%	0.08%	0.04%	0.05%	0.05%	0.08%	0.10%	0.18%	0.32%	0.24%
diff::simple::Log4555::max		0.63%	0.49%	0.81%	0.80%	0.74%	0.75%	0.63%	0.63%	0.57%	0.71%	0.84%	1.35%	1.94%	1.86%
diff::simple::Log4555::min		0.50%	0.15%	0.44%	0.40%	0.40%	0.47%	0.40%	0.39%	0.38%	0.39%	0.26%	0.57%	0.66%	0.68%
diff::weighted2	0.00%	0.95%	0.99%	1.25%	1.12%	0.81%	0.83%	1.31%	0.97%	0.92%	0.71%	0.78%	0.98%	1.21%	1.65%
diff::weighted2::Log::err/C100sigma		0.12	0.3	1.75	1.04	-0.69	-0.57	2.09	0.2	-0.08	-1.23	-0.87	0.24	1.5	3.96
diff::weighted2::Log::ex		0.93%	0.79%	0.93%	0.93%	0.93%	0.93%	0.93%	0.94%	0.93%	0.93%	0.90%	2.07%	3.25%	2.63%
diff::weighted2::Log::sigma		0.14%	0.22%	0.18%	0.17%	0.18%	0.18%	0.18%	0.18%	0.17%	0.18%	0.22%	0.56%	0.97%	0.72%
diff::weighted2::Log::max		1.36%	1.29%	1.36%	1.46%	1.36%	1.41%	1.34%	1.51%	1.45%	1.47%	1.38%	3.06%	5.55%	4.27%
diff::weighted2::Log::min		0.64%	0.38%	0.53%	0.62%	0.57%	0.48%	0.51%	0.56%	0.57%	0.53%	0.43%	0.93%	1.21%	1.31%
diff::weighted2::Log4060::err/C100sigma		-0.37	-0.2	1.11	0.47	-1.11	-1	1.42	-0.3	-0.55	-1.59	-1.27	-0.26	0.89	3.13
diff::weighted2::Log4060::ex		0.82%	0.67%	1.03%	0.92%	0.95%	0.96%	0.97%	0.87%	0.86%	0.78%	0.95%	1.95%	2.78%	2.69%
diff::weighted2::Log4060::sigma		0.09%	0.16%	0.20%	0.19%	0.17%	0.16%	0.15%	0.12%	0.12%	0.12%	0.20%	0.43%	0.73%	0.61%
diff::weighted2::Log4060::max		1.01%	1.08%	1.49%	1.36%	1.39%	1.36%	1.36%	1.19%	1.19%	1.11%	1.45%	2.87%	4.25%	4.09%
diff::weighted2::Log4060::min		0.65%	0.29%	0.68%	0.58%	0.59%	0.66%	0.67%	0.65%	0.64%	0.50%	0.51%	1.10%	1.38%	1.27%
diff::weighted2::Log4555::err/C100sigma		-0.39	-0.25	0.84	0.31	-1	-0.91	1.1	-0.33	-0.54	-1.41	-1.14	-0.3	0.66	2.52
diff::weighted2::Log4555::ex		0.78%	0.61%	1.05%	0.86%	0.97%	1.04%	0.92%	0.91%	0.80%	0.81%	0.95%	1.75%	2.54%	2.32%
diff::weighted2::Log4555::sigma		0.07%	0.10%	0.24%	0.14%	0.21%	0.16%	0.08%	0.12%	0.11%	0.12%	0.18%	0.42%	0.73%	0.42%
diff::weighted2::Log4555::max		1.03%	0.85%	1.48%	1.27%	1.36%	1.35%	1.19%	1.18%	1.05%	1.10%	1.55%	2.89%	4.25%	3.42%
diff::weighted2::Log4555::min		0.64%	0.36%	0.68%	0.58%	0.65%	0.82%	0.75%	0.62%	0.61%	0.49%	0.60%	1.10%	1.38%	1.27%
										
5states,GA,NC,PA,NV,AZ								
cands	theory	DonaldTrump	JoeBiden	C100	C66	C60	C55	C50	C45	C40	C33	JoJorgensen	HowieHawkins	DonBlankenship	KanyeWest
1	30.10%	30.45%	27.09%	28.77%	29.05%	29.05%	30.17%	31.28%	30.73%	29.89%	30.73%	27.37%	28.00%	27.35%	
2	17.61%	19.27%	20.11%	18.44%	19.27%	17.88%	18.44%	17.88%	14.53%	17.04%	17.32%	18.16%	19.00%	15.38%	
3	12.49%	11.17%	9.78%	12.85%	11.45%	10.61%	10.34%	12.01%	14.53%	13.13%	13.13%	13.13%	11.00%	14.53%	
4	9.69%	9.22%	13.97%	9.78%	8.94%	11.73%	12.29%	10.06%	9.22%	9.78%	9.78%	10.61%	10.00%	7.69%	
5	7.92%	5.87%	5.31%	8.10%	8.38%	7.82%	6.70%	8.38%	8.66%	8.38%	7.26%	8.38%	9.00%	12.82%	
6	6.69%	8.10%	6.42%	3.91%	6.70%	6.70%	6.98%	5.31%	6.70%	6.42%	6.70%	8.10%	6.00%	4.27%	
7	5.80%	5.87%	5.87%	8.10%	6.42%	6.15%	5.03%	7.26%	5.59%	4.19%	6.15%	5.87%	6.00%	10.26%	
8	5.12%	5.03%	6.15%	5.31%	4.75%	5.31%	6.70%	4.47%	3.63%	6.42%	5.03%	3.91%	7.00%	5.13%	
9	4.58%	5.03%	5.31%	4.75%	5.03%	4.75%	3.35%	3.35%	6.42%	4.75%	3.91%	4.47%	4.00%	2.56%	
votes		10928687	10992747	22214842	14809879.86	13328905.2	12218163.1	11107421	9996678.9	8885936.8	7404939.93	256447	12195	10687	
nof_regions		358	358	358	358	358	358	358	358	358	358	358	100	117	
diff::simple	0.00%	0.87%	1.91%	0.91%	0.71%	0.67%	1.19%	0.83%	1.17%	0.59%	0.38%	0.90%	1.08%	2.54%	
diff::simple::Log::err/C100sigma		-0.03	3.76	0.12	-0.62	-0.77	1.13	-0.19	1.04	-1.06	-1.84	0.05	0.72	6.03	
diff::simple::Log::ex		0.95%	1.16%	0.88%	0.88%	0.88%	0.88%	0.89%	0.88%	0.88%	0.88%	1.19%	1.93%	2.10%	
diff::simple::Log::sigma		0.22%	0.30%	0.27%	0.29%	0.26%	0.27%	0.27%	0.29%	0.29%	0.28%	0.21%	0.44%	0.48%	
diff::simple::Log::max		1.46%	2.14%	1.73%	1.68%	1.62%	1.73%	1.69%	1.55%	1.60%	1.55%	1.68%	3.26%	3.46%	
diff::simple::Log::min		0.51%	0.53%	0.35%	0.26%	0.40%	0.38%	0.45%	0.24%	0.25%	0.25%	0.59%	1.04%	1.06%	
diff::simple::Log4060::err/C100sigma		-0.95	2.98	-0.8	-1.55	-1.71	0.26	-1.11	0.16	-2.02	-2.83	-0.86	-0.16	5.33	
diff::simple::Log4060::ex		0.85%	1.15%	1.13%	0.78%	0.80%	0.77%	0.74%	0.68%	0.61%	0.74%	1.21%	1.79%	1.75%	
diff::simple::Log4060::sigma		0.24%	0.24%	0.26%	0.25%	0.25%	0.25%	0.20%	0.16%	0.13%	0.26%	0.18%	0.39%	0.36%	
diff::simple::Log4060::max		1.36%	1.64%	1.73%	1.32%	1.32%	1.32%	1.30%	1.16%	0.90%	1.38%	1.62%	2.73%	2.51%	
diff::simple::Log4060::min		0.42%	0.65%	0.59%	0.32%	0.35%	0.35%	0.35%	0.35%	0.23%	0.23%	0.77%	1.14%	1.06%	
diff::simple::Log4555::err/C100sigma		-0.59	5.31	-0.36	-1.49	-1.73	1.22	-0.83	1.08	-2.19	-3.4	-0.45	0.59	8.84	
diff::simple::Log4555::ex		0.98%	1.06%	0.98%	0.82%	0.87%	0.86%	0.68%	0.63%	0.68%	0.70%	1.18%	1.53%	1.68%	
diff::simple::Log4555::sigma		0.23%	0.26%	0.18%	0.27%	0.27%	0.20%	0.18%	0.14%	0.12%	0.29%	0.20%	0.25%	0.37%	
diff::simple::Log4555::max		1.36%	1.55%	1.37%	1.32%	1.32%	1.30%	1.10%	0.88%	0.90%	1.33%	1.56%	2.23%	2.26%	
diff::simple::Log4555::min		0.60%	0.57%	0.59%	0.25%	0.38%	0.49%	0.35%	0.30%	0.47%	0.23%	0.77%	1.14%	1.06%	
diff::weighted2	0.00%	1.58%	3.02%	1.91%	1.16%	1.03%	2.57%	1.92%	2.27%	1.41%	0.74%	1.48%	1.97%	5.11%	
diff::weighted2::Log::err/C100sigma		-0.42	2.1	0.16	-1.15	-1.37	1.31	0.17	0.78	-0.7	-1.88	-0.58	0.26	5.74	
diff::weighted2::Log::ex		1.84%	2.32%	1.82%	1.83%	1.81%	1.82%	1.83%	1.82%	1.81%	1.81%	2.18%	3.77%	4.01%	
diff::weighted2::Log::sigma		0.43%	0.53%	0.57%	0.58%	0.58%	0.57%	0.57%	0.58%	0.58%	0.56%	0.43%	0.85%	0.98%	
diff::weighted2::Log::max		3.17%	3.66%	3.16%	3.46%	3.16%	3.16%	3.12%	3.17%	3.20%	3.20%	3.43%	6.79%	6.66%	
diff::weighted2::Log::min		0.96%	1.18%	0.77%	0.66%	0.82%	0.81%	0.80%	0.56%	0.57%	0.57%	1.07%	1.97%	1.90%	
diff::weighted2::Log4060::err/C100sigma		-1.54	1.5	-0.84	-2.42	-2.69	0.55	-0.82	-0.09	-1.88	-3.29	-1.74	-0.72	5.88	
diff::weighted2::Log4060::ex		1.75%	2.39%	2.31%	1.53%	1.53%	1.44%	1.39%	1.33%	1.22%	1.48%	2.31%	3.52%	3.28%	
diff::weighted2::Log4060::sigma		0.50%	0.62%	0.48%	0.51%	0.49%	0.43%	0.36%	0.33%	0.27%	0.49%	0.33%	0.69%	0.71%	
diff::weighted2::Log4060::max		3.18%	3.66%	3.27%	2.91%	2.91%	2.43%	2.31%	2.31%	2.01%	2.59%	3.15%	4.99%	4.68%	
diff::weighted2::Log4060::min		0.96%	1.32%	1.22%	0.67%	0.66%	0.69%	0.69%	0.69%	0.60%	0.59%	1.51%	2.34%	1.86%	
diff::weighted2::Log4555::err/C100sigma		-1.54	2.15	-0.69	-2.62	-2.94	0.99	-0.67	0.22	-1.96	-3.67	-1.78	-0.55	7.47	
diff::weighted2::Log4555::ex		1.96%	2.36%	2.18%	1.73%	1.54%	1.52%	1.34%	1.25%	1.29%	1.35%	2.35%	3.25%	3.06%	
diff::weighted2::Log4555::sigma		0.54%	0.65%	0.39%	0.56%	0.48%	0.41%	0.36%	0.24%	0.29%	0.45%	0.39%	0.54%	0.76%	
diff::weighted2::Log4555::max		3.15%	3.66%	3.10%	2.91%	2.43%	2.31%	2.31%	1.70%	2.03%	2.46%	3.15%	4.30%	4.28%	
diff::weighted2::Log4555::min		1.18%	1.17%	1.22%	0.59%	0.77%	0.75%	0.66%	0.65%	0.76%	0.59%	1.51%	2.34%	1.86%	
										
2states,MI,WI									
cands	theory	DonaldTrump	JoeBiden	C100	C66	C60	C55	C50	C45	C40	C33	JoJorgensen	HowieHawkins	DonBlankenship	KanyeWest
1	30.10%	27.74%	21.29%	33.55%	32.26%	27.74%	27.74%	27.74%	26.45%	25.16%	23.87%	32.90%	31.33%	32.26%	
2	17.61%	14.84%	18.06%	18.71%	12.90%	15.48%	14.19%	14.84%	16.13%	13.55%	20.65%	16.77%	24.10%	20.65%	
3	12.49%	12.90%	14.84%	9.03%	10.97%	10.32%	10.97%	10.97%	16.13%	16.13%	12.26%	10.32%	7.23%	13.55%	
4	9.69%	11.61%	12.26%	9.03%	7.74%	8.39%	14.19%	12.90%	10.32%	10.97%	10.97%	7.10%	14.46%	9.68%	
5	7.92%	10.32%	9.03%	5.81%	12.90%	10.97%	9.03%	9.03%	5.16%	9.03%	10.97%	8.39%	10.84%	4.52%	
6	6.69%	3.23%	9.03%	6.45%	6.45%	7.74%	5.16%	5.16%	10.32%	10.32%	3.87%	9.03%	2.41%	8.39%	
7	5.80%	6.45%	5.81%	4.52%	5.81%	4.52%	4.52%	11.61%	8.39%	3.23%	9.03%	3.87%	1.20%	2.58%	
8	5.12%	5.81%	3.23%	9.68%	3.23%	7.74%	9.68%	5.16%	2.58%	5.81%	4.52%	6.45%	2.41%	3.87%	
9	4.58%	7.10%	6.45%	3.23%	7.74%	7.10%	4.52%	2.58%	4.52%	5.81%	3.87%	5.16%	6.02%	4.52%	
votes		4261335	4437572	8832164	5888103.45	5299298.4	4857690.2	4416082	3974473.8	3532865.6	2944051.72	98898	13733	12382	
nof_regions		155	155	155	155	155	155	155	155	155	155	155	83	155	
diff::simple	0.00%	1.91%	2.38%	2.02%	2.29%	2.05%	2.26%	2.26%	2.33%	2.57%	2.35%	1.67%	3.74%	1.76%	
diff::simple::Log::err/C100sigma		-0.7	0.46	-0.42	0.24	-0.35	0.17	0.17	0.34	0.94	0.4	-1.29	3.85	-1.07	
diff::simple::Log::ex		1.79%	2.10%	2.19%	2.18%	2.18%	2.19%	2.18%	2.18%	2.19%	2.18%	1.42%	2.96%	1.85%	
diff::simple::Log::sigma		0.42%	0.31%	0.40%	0.39%	0.42%	0.40%	0.40%	0.40%	0.40%	0.40%	0.29%	0.61%	0.41%	
diff::simple::Log::max		2.82%	2.79%	3.31%	3.22%	3.31%	3.31%	3.16%	3.45%	3.31%	3.45%	2.11%	4.68%	3.21%	
diff::simple::Log::min		0.92%	1.31%	1.24%	1.36%	1.23%	1.24%	1.23%	1.24%	1.24%	1.24%	0.91%	1.75%	0.91%	
diff::simple::Log4060::err/C100sigma		-1.71	-0.04	-1.31	-0.35	-1.2	-0.46	-0.45	-0.22	0.65	-0.13	-2.56	4.84	-2.24	
diff::simple::Log4060::ex		1.92%	2.12%	2.39%	2.49%	2.34%	2.26%	2.22%	2.00%	1.88%	1.70%	1.33%	2.68%	1.79%	
diff::simple::Log4060::sigma		0.42%	0.26%	0.28%	0.39%	0.28%	0.27%	0.36%	0.38%	0.35%	0.23%	0.21%	0.52%	0.49%	
diff::simple::Log4060::max		2.68%	2.78%	3.18%	3.31%	3.07%	2.78%	2.77%	2.59%	2.59%	2.35%	2.15%	3.49%	2.81%	
diff::simple::Log4060::min		1.05%	1.62%	1.78%	1.62%	1.62%	1.62%	1.23%	1.23%	1.23%	1.24%	0.95%	1.67%	0.96%	
diff::simple::Log4555::err/C100sigma		-1.63	0.11	-1.21	-0.21	-1.09	-0.32	-0.32	-0.07	0.83	0.02	-2.51	5.19	-2.17	
diff::simple::Log4555::ex		2.19%	2.14%	2.35%	2.35%	2.28%	2.37%	2.29%	2.13%	1.74%	1.82%	1.27%	2.95%	1.91%	
diff::simple::Log4555::sigma		0.28%	0.15%	0.27%	0.40%	0.32%	0.22%	0.21%	0.36%	0.35%	0.20%	0.16%	0.39%	0.53%	
diff::simple::Log4555::max		2.78%	2.52%	2.88%	3.31%	2.78%	2.78%	2.63%	2.59%	2.44%	2.35%	1.58%	3.49%	2.81%	
diff::simple::Log4555::min		1.51%	1.79%	1.78%	1.62%	1.62%	1.91%	1.69%	1.23%	1.23%	1.52%	0.97%	1.73%	0.96%	
diff::weighted2	0.00%	3.84%	3.75%	4.11%	4.39%	4.29%	4.33%	4.61%	4.42%	4.32%	3.98%	3.15%	7.30%	3.35%	
diff::weighted2::Log::err/C100sigma		-0.16	-0.26	0.16	0.5	0.38	0.42	0.75	0.53	0.41	0.01	-0.98	3.94	-0.73	
diff::weighted2::Log::ex		3.44%	3.68%	3.97%	3.95%	3.96%	3.97%	3.93%	3.96%	3.96%	3.96%	2.63%	5.57%	3.43%	
diff::weighted2::Log::sigma		0.89%	0.68%	0.84%	0.78%	0.85%	0.84%	0.84%	0.84%	0.85%	0.83%	0.72%	1.12%	0.90%	
diff::weighted2::Log::max		5.91%	5.12%	5.81%	5.93%	5.70%	5.81%	5.60%	6.20%	6.17%	5.87%	4.82%	8.24%	5.90%	
diff::weighted2::Log::min		1.70%	2.04%	2.05%	2.16%	2.05%	2.05%	2.05%	1.96%	2.00%	1.96%	1.57%	3.06%	1.27%	
diff::weighted2::Log4060::err/C100sigma		-1.5	-1.66	-0.99	-0.43	-0.63	-0.55	-0.02	-0.37	-0.58	-1.22	-2.83	5.15	-2.43	
diff::weighted2::Log4060::ex		3.59%	4.04%	4.62%	4.17%	3.82%	3.68%	3.75%	3.42%	3.38%	3.01%	2.23%	4.74%	3.25%	
diff::weighted2::Log4060::sigma		0.63%	0.62%	0.52%	0.78%	0.68%	0.64%	0.63%	0.48%	0.56%	0.51%	0.45%	0.71%	1.18%	
diff::weighted2::Log4060::max		4.70%	5.07%	6.17%	5.54%	5.27%	5.10%	5.10%	4.54%	4.61%	4.61%	3.89%	6.34%	6.16%	
diff::weighted2::Log4060::min		2.09%	2.44%	3.41%	2.05%	2.05%	2.05%	2.34%	2.34%	2.34%	1.96%	1.48%	3.19%	1.38%	
diff::weighted2::Log4555::err/C100sigma		-1.41	-1.56	-0.9	-0.35	-0.55	-0.48	0.05	-0.3	-0.5	-1.13	-2.71	5.12	-2.32	
diff::weighted2::Log4555::ex		3.91%	4.29%	4.58%	3.82%	3.84%	3.98%	3.54%	3.60%	3.28%	3.17%	2.18%	5.08%	3.17%	
diff::weighted2::Log4555::sigma		0.41%	0.35%	0.53%	0.79%	0.81%	0.64%	0.32%	0.52%	0.55%	0.50%	0.42%	0.57%	1.26%	
diff::weighted2::Log4555::max		5.19%	5.02%	5.61%	5.40%	5.10%	5.10%	4.26%	4.73%	4.48%	4.61%	2.98%	6.34%	6.00%	
diff::weighted2::Log4555::min		2.98%	3.52%	3.41%	2.05%	2.05%	2.87%	2.87%	2.34%	2.34%	2.50%	1.48%	3.19%	1.38%	
										
15swings,AZ,CO,FL,GA,IA,MI,MN,NV,NH,NC,OH,PA,TX,VA,WI				
cands	theory	DonaldTrump	JoeBiden	C100	C66	C60	C55	C50	C45	C40	C33	JoJorgensen	HowieHawkins	DonBlankenship	KanyeWest
1	30.10%	29.73%	28.14%	30.04%	30.57%	28.97%	28.97%	28.59%	27.91%	26.84%	27.83%	29.15%	31.76%	28.06%	33.73%
2	17.61%	16.50%	18.71%	17.95%	15.82%	16.50%	16.81%	17.19%	16.88%	16.81%	18.56%	18.49%	19.93%	17.43%	17.27%
3	12.49%	11.79%	12.62%	10.65%	12.02%	12.17%	12.02%	12.02%	13.61%	15.21%	13.31%	12.48%	10.14%	12.42%	12.45%
4	9.69%	9.58%	12.62%	9.35%	8.97%	10.34%	11.56%	12.17%	10.87%	9.51%	9.73%	9.13%	9.90%	7.82%	9.24%
5	7.92%	8.37%	6.31%	7.83%	9.58%	9.51%	8.59%	7.68%	7.76%	7.91%	8.37%	8.07%	8.21%	10.62%	7.23%
6	6.69%	7.15%	6.84%	5.93%	7.68%	6.69%	6.54%	6.24%	6.54%	7.68%	6.77%	6.85%	5.80%	8.22%	5.22%
7	5.80%	5.93%	5.48%	6.08%	5.63%	5.70%	5.10%	7.00%	6.62%	4.94%	6.77%	6.09%	5.80%	6.41%	5.62%
8	5.12%	5.10%	4.87%	6.54%	5.02%	5.02%	6.24%	4.87%	4.49%	5.86%	5.25%	4.34%	4.95%	5.01%	4.02%
9	4.58%	5.86%	4.41%	5.63%	4.71%	5.10%	4.18%	4.26%	5.32%	5.25%	3.42%	5.40%	3.50%	4.01%	5.22%
votes		35976971	35784824	72796870	48531198.14	43678122	40038278.5	36398435	32758591.5	29118748	24265599.07	804341	115099	33738	19224
nof_regions		1315	1315	1315	1315	1315	1315	1315	1315	1315	1315	1314	828	499	249
diff::simple	0.00%	0.51%	0.96%	0.69%	0.72%	0.61%	0.81%	0.82%	0.86%	1.14%	0.76%	0.51%	1.00%	1.08%	0.95%
diff::simple::Log::err/C100sigma		-2.64	0.5	-1.41	-1.16	-1.94	-0.52	-0.5	-0.2	1.76	-0.9	-2.66	0.77	1.33	0.45
diff::simple::Log::ex		0.62%	0.74%	0.89%	0.88%	0.89%	0.89%	0.89%	0.88%	0.88%	0.88%	0.69%	1.38%	1.66%	2.05%
diff::simple::Log::sigma		0.12%	0.16%	0.14%	0.13%	0.14%	0.14%	0.14%	0.14%	0.13%	0.13%	0.15%	0.35%	0.40%	0.61%
diff::simple::Log::max		0.95%	1.10%	1.24%	1.28%	1.33%	1.25%	1.31%	1.30%	1.22%	1.28%	1.10%	2.45%	2.52%	3.71%
diff::simple::Log::min		0.33%	0.42%	0.61%	0.62%	0.60%	0.61%	0.62%	0.61%	0.63%	0.63%	0.29%	0.77%	0.72%	0.95%
diff::simple::Log4060::err/C100sigma		-2.65	0.17	-1.54	-1.32	-2.02	-0.74	-0.73	-0.45	1.31	-1.08	-2.67	0.42	0.92	0.13
diff::simple::Log4060::ex		0.67%	0.70%	0.93%	1.00%	0.98%	0.91%	0.91%	0.83%	0.79%	0.81%	0.62%	1.26%	1.46%	2.19%
diff::simple::Log4060::sigma		0.11%	0.14%	0.16%	0.13%	0.14%	0.16%	0.16%	0.12%	0.08%	0.09%	0.11%	0.28%	0.51%	0.53%
diff::simple::Log4060::max		0.95%	1.00%	1.31%	1.35%	1.35%	1.30%	1.35%	1.16%	1.02%	1.01%	0.98%	1.81%	2.68%	3.25%
diff::simple::Log4060::min		0.48%	0.47%	0.66%	0.75%	0.63%	0.63%	0.63%	0.63%	0.64%	0.69%	0.40%	0.78%	0.72%	1.10%
diff::simple::Log4555::err/C100sigma		-3.31	0.91	-1.65	-1.32	-2.37	-0.46	-0.44	-0.03	2.6	-0.96	-3.33	1.28	2.02	0.84
diff::simple::Log4555::ex		0.62%	0.63%	0.86%	0.95%	0.97%	1.04%	0.87%	0.78%	0.82%	0.82%	0.62%	1.16%	1.22%	2.06%
diff::simple::Log4555::sigma		0.07%	0.11%	0.11%	0.13%	0.15%	0.10%	0.15%	0.10%	0.08%	0.09%	0.11%	0.27%	0.34%	0.61%
diff::simple::Log4555::max		0.77%	0.86%	1.08%	1.21%	1.33%	1.31%	1.16%	1.00%	1.00%	1.01%	0.86%	1.81%	1.90%	2.94%
diff::simple::Log4555::min		0.48%	0.44%	0.68%	0.71%	0.72%	0.89%	0.62%	0.61%	0.66%	0.71%	0.40%	0.75%	0.72%	1.10%
diff::weighted2	0.00%	1.05%	1.48%	1.63%	1.22%	1.00%	1.56%	1.45%	1.46%	1.80%	1.31%	1.04%	1.53%	2.02%	1.62%
diff::weighted2::Log::err/C100sigma		-1.84	-0.22	0.34	-1.2	-2.05	0.08	-0.33	-0.29	0.97	-0.88	-1.9	-0.02	1.8	0.32
diff::weighted2::Log::ex		1.10%	1.33%	1.54%	1.53%	1.54%	1.54%	1.54%	1.53%	1.53%	1.53%	1.32%	2.78%	3.43%	4.02%
diff::weighted2::Log::sigma		0.23%	0.35%	0.26%	0.26%	0.27%	0.26%	0.26%	0.26%	0.25%	0.26%	0.31%	0.64%	0.82%	1.36%
diff::weighted2::Log::max		1.69%	2.23%	2.39%	2.24%	2.61%	2.38%	2.56%	2.28%	2.15%	2.22%	1.96%	4.08%	5.29%	7.10%
diff::weighted2::Log::min		0.69%	0.72%	1.06%	1.04%	1.00%	1.07%	1.01%	1.03%	0.98%	0.98%	0.57%	1.27%	1.58%	1.62%
diff::weighted2::Log4060::err/C100sigma		-2.1	-0.58	-0.06	-1.5	-2.3	-0.3	-0.68	-0.64	0.54	-1.2	-2.15	-0.39	1.31	-0.07
diff::weighted2::Log4060::ex		1.04%	1.19%	1.65%	1.69%	1.75%	1.69%	1.70%	1.53%	1.40%	1.30%	1.23%	2.72%	2.91%	4.65%
diff::weighted2::Log4060::sigma		0.22%	0.29%	0.28%	0.30%	0.28%	0.30%	0.28%	0.21%	0.17%	0.18%	0.19%	0.51%	0.83%	1.27%
diff::weighted2::Log4060::max		1.62%	1.89%	2.29%	2.63%	2.63%	2.51%	2.63%	2.09%	1.83%	1.83%	1.94%	4.09%	4.81%	7.11%
diff::weighted2::Log4060::min		0.62%	0.71%	1.04%	1.15%	1.25%	1.23%	1.18%	1.18%	1.06%	0.97%	0.84%	1.84%	1.58%	2.05%
diff::weighted2::Log4555::err/C100sigma		-2.15	-0.5	0.07	-1.5	-2.37	-0.19	-0.61	-0.57	0.72	-1.17	-2.21	-0.29	1.57	0.06
diff::weighted2::Log4555::ex		0.97%	1.16%	1.61%	1.60%	1.79%	1.92%	1.62%	1.50%	1.45%	1.29%	1.21%	2.69%	2.68%	4.46%
diff::weighted2::Log4555::sigma		0.14%	0.29%	0.26%	0.21%	0.34%	0.23%	0.22%	0.13%	0.15%	0.18%	0.20%	0.57%	0.78%	1.42%
diff::weighted2::Log4555::max		1.27%	1.86%	2.14%	2.09%	2.61%	2.57%	2.05%	1.78%	1.77%	1.83%	1.75%	4.09%	4.23%	6.76%
diff::weighted2::Log4555::min		0.66%	0.69%	1.15%	1.25%	1.26%	1.43%	1.17%	1.19%	1.13%	1.04%	0.84%	1.82%	1.58%	2.05%


