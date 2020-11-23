// ==UserScript==
(function(outer_result){
  var pseudoCands = [1, 0.666666, 0.6, 0.55, 0.5, 0.45, 0.4, 0.333333].reduce((a,c)=>{a['C'+(c*100).toString().split('.')[0]] = c; return a;},{});
  function prep_scales(obj, prop){
    Object.defineProperty(obj, prop||'SCALED', {value:{Linear:{}, Log:{}, Log4060:{}, Log4555:{}}, writable:true, configurable:true});
  }
  var scales = {Linear:{}, Log:{}, Log4060:{}, Log4555:{}};
  var nof_scales = 100;
  for (var i=0;i<nof_scales;i++) {
    scales.Linear[i] = 1+9*i/nof_scales;
    scales.Log[i] = Math.pow(10, i/nof_scales);
    scales.Log4060[i] = 4*Math.pow(1.5, i/nof_scales);
    scales.Log4555[i] = 4.5*Math.pow((55/45), i/nof_scales);
  }
  var remove_SCALED = nof_scales>10; // for less memory usage
  function count(results, regions, cand_prop){
    var bens = {};
    var arr_bens = [bens].concat(results.map(r=>r.bens));
    regions.forEach(county => {
      var votes = county[cand_prop||'candidates'].map(cand => count_by_cand(arr_bens, cand)).reduce((a,c)=>a+c);
      for (var i in pseudoCands) count_by_cand(arr_bens, makePseudoCand(votes, i, pseudoCands[i]));
      results.forEach(r=>r.votes += votes);
    });
    results.forEach(r=>r.nof_regions += regions.length);
    var props = make_props(bens);
    return {bens, nof_regions:regions.length, props, diffs:make_diffs(props)};
  }
  var makePseudoCand;
  var countByCand_1;
  function count_by_cand(arr_bens, cand){
    for (var i=1;i<arr_bens.length;i++) countByCand_1(arr_bens[i], cand);
    return countByCand_1(arr_bens[0], cand);
  }
  function count_by_cand_11(bens, name, votes){
    count_by_cand_111(bens, name, votes);
    if (!bens[name].SCALED) prep_scales(bens[name]);
    for (var s in scales) for (var i in scales[s]) count_by_cand_111(bens[name].SCALED[s], i, votes*scales[s][i]);
  }
  function count_by_cand_111(bens, name, votes){
    if (!bens[name]) bens[name] = Object.defineProperty({}, 'votes', {value:0, writable:true, configurable:true});
    bens[name].votes += votes;
    var str0 = votes.toString()[0];
    bens[name][str0] = (bens[name][str0]||0) +1;
  }
  var props_theoretical = {ex:0};
  for (var i=1;i<10;i++) {
    props_theoretical[i] = Math.log10(i+1)-Math.log10(i);
    props_theoretical.ex += props_theoretical[i]*props_theoretical[i];
  }
  function make_props(bens){
    var props = {theory:props_theoretical};
    for (var c in bens){
      var num = 0;
      for (var i in bens[c]) num += bens[c][i];
      props[c] = Object.defineProperty({}, 'nof_regions', {value:num, writable:true, configurable:true});
      for (var i in bens[c]) props[c][i] = bens[c][i]/num;
      if (bens[c].SCALED) {
        prep_scales(props[c]);
        for (var s in bens[c].SCALED) props[c].SCALED[s] = make_props(bens[c].SCALED[s]);
        if (remove_SCALED) delete bens[c].SCALED;
      }
    }
    return props;
  }
  function make_diffs(props, ref){
    var diffs = {theory:make_diffs_1(props, props_theoretical)};
    for (var i in pseudoCands) diffs[i] = make_diffs_1(props, props[i]);
    return diffs;
  }
  function make_diffs_1(props, ref){
    var simple    = make_diff_1(props, (diff,i)=>Math.abs(diff),                             ref);
    var weighted  = make_diff_1(props, (diff,i)=>Math.abs(diff)                     /ref[i], ref);
    var weighted2 = make_diff_1(props, (diff,i)=>Math.abs(diff)*props_theoretical.ex/ref[i], ref);
    if (remove_SCALED) for (var c in props) delete props[c].SCALED;
    return {simple, weighted, weighted2};
  }
  function make_diff_1(props, func, ref){
    var diff = {};
    for (var c in props){
      diff[c] = {avg:0};
      for (var i=1;i<10;i++) {//  in props[c]) {
        diff[c][i] = func((props[c][i]||0)-ref[i],i);
        diff[c].avg += diff[c][i];
      }
      diff[c].avg /= Object.keys(props[c]).length;
      if (props[c].SCALED) {
        prep_scales(diff[c]);
        for (var s in diff[c].SCALED) diff[c].SCALED[s] = make_diff_1(props[c].SCALED[s], func, ref);
        prep_scales(diff[c], 'STATS');
        for (var s in diff[c].SCALED) diff[c].STATS[s] = make_stats(diff[c].SCALED[s]);
        if (remove_SCALED) delete diff[c].SCALED;
      }
    }
    return diff;
  }
  function make_stats(scales){
    var ex = 0;
    var max = -Infinity;
    var min = Infinity;
    var num = 0;
    var max_idx = -1;
    var min_idx = -1;
    for (var i=0;i<nof_scales;i++) if (i in scales) {
      var avg = scales[i].avg;
      ex += avg;
      num++;
      if (avg>max) {max = avg; max_idx = i;}
      if (avg<min) {min = avg; min_idx = i;}
    }
    ex /= num;
    var sigma = 0;
    for (var i=0;i<nof_scales;i++) if (i in scales) {
      var diff = scales[i].avg - ex;
      sigma += diff * diff;
    }
    return {ex, num, max, min, sigma:Math.sqrt(sigma/num), max_idx, min_idx};
  }
  function make_result(state, data, prop){
    var results = Object.keys(recipes).filter(k=>recipes[k].indexOf(state)!=-1).map(k=>retval.aggregated[k]);
    var result = count(results, data, prop);
    retval.states[state] = result
    console.log(state, result);
  }
  function make_result_US(){
    Promise.all(jobs).then(
      _ => {
        Object.keys(recipes).forEach(k=>{
          var result = retval.aggregated[k];
          result.props = make_props(result.bens);
          result.diffs = make_diffs(result.props);
          console.log(k,result);
        });
        dump_result(retval.aggregated);
        console.log(retval);
      }
    );
  }

//  var states = ["IL"];
//  var states = ["WI"];
  var states = ['VT', 'SC', 'IN', 'KY', 'GA', 'VA', 'WV', 'NC', 'OH', 'MA',
                'AL', 'FL', 'DE', 'MD', 'DC', 'NH', 'MS', 'RI', 'ME', 'NJ',
                'OK', 'PA', 'IL', 'CT', 'MO', 'TN', 'AR', 'NY', 'ND', 'CO',
                'MI', 'KS', 'NE', 'MN', 'TX', 'NM', 'WI', 'WY', 'LA', 'AZ',
                'SD', 'UT', 'MT', 'NV', 'IA', 'ID', 'OR', 'CA', 'WA', 'HI', 'AK'];
  var recipes = {all:states,
                 '5states':['GA', 'NC', 'PA', 'NV', 'AZ'],
                 '2states':["MI", "WI"],
                 '15swings':['AZ','CO','FL','GA','IA','MI','MN','NV','NH','NC','OH','PA','TX','VA','WI']};
  var recipe_keys = ['all','5states','2states','15swings'];
  var retval = {recipes, states:{}, aggregated:{}};
  for (var i in recipes) retval.aggregated[i] = {bens:{}, nof_regions:0, votes:0};
  if (outer_result) for (var i in retval) outer_result[i] = retval[i];
  var jobs = [];
  var candsHead;
  if (window.location.origin.indexOf('ap.org')!=-1) { // for https://digg.com/2020/2020-presidential-electoral-map-trump-biden
    makePseudoCand = function(votes, name, approval_rate){
      return {name:name, voteCount: votes*approval_rate};
    };
    countByCand_1 = function(bens, cand){
      if (cand.voteCount==0) return 0;
      count_by_cand_11(bens, cand.name || metadata.candidates[cand.candidateID].fullName, cand.voteCount);
      return cand.voteCount;
    };
    candsHead = ['Donald Trump','Joe Biden'];
    var metadata = null;
    var url_meta = 'https://interactives.ap.org/elections/live-data/production/2020-11-03/president/metadata.json';
    jobs.push(
      fetch(url_meta)
        .then(res => res.json())
        .then(data => {
          metadata = data;
          for (var i=0;i<states.length;i++) {
            var url_state = 'https://interactives.ap.org/elections/live-data/production/2020-11-03/president/'+states[i]+'.json';
            jobs.push(fetch(url_state)
                      .then(res => res.json())
                      .then(data => {
                        var counties = [];
                        for (var c in data.results[0].results) counties.push(data.results[0].results[c]);
                        make_result(data.results[0].raceID.slice(0,2), counties, 'results');}));
          }
          make_result_US();
        }));
  } else { // for https://edition.cnn.com/election/2020/results/state/wisconsin/president
    makePseudoCand = function(votes, name, approval_rate){
      return {lastName:name,
              voteNum: votes*approval_rate,
              voteStr:(votes*approval_rate).toString()};
    };
    countByCand_1 = function(bens, cand){
      if (cand.voteNum===0) return 0;
      count_by_cand_11(bens, cand.lastName, cand.voteNum) //;Str[0]);
      return cand.voteNum;
    };
    candsHead = ['Trump','Biden'];
    for (var i=0;i<states.length;i++) {
      var url = 'https://politics-elex-results.data.api.cnn.io/results/view/2020-county-races-PG-'+states[i]+'.json';
      jobs.push(fetch(url)
                .then(res => res.json())
                .then(data => make_result(data[0].stateAbbreviation, data)));
    }
    make_result_US();
  }

  function dump_result(results){
    var res_all = results.all;
    var sort_func = (a,b)=>(res_all.props[b]? res_all.props[b].nof_regions : 0) - (res_all.props[a]? res_all.props[a].nof_regions : 0);
    var cands_head = ['theory'].concat(candsHead, 'C100','C66','C60','C55','C50','C45','C40','C33');
    var cands = cands_head.concat(Object.keys(res_all.props).sort(sort_func).filter(c=>cands_head.indexOf(c)==-1));
    print('short summary:');
    dump_summary(results, ['Log']);
    print('summary:');
    dump_summary(results, ['Log', 'Log4060', 'Log4555'], ['C100ex', 'C100sigma']);
    print('details:');
    recipe_keys.forEach(k=>{
      print (k, k!=='all'? recipes[k] : undefined);
      dump_detail(cands, results[k]);
    });
  }

  function print(col0, arr){
    console.log(arr? [col0].concat(arr).join() : col0);
  }
  function calc_err_sigma(avg,stat){
    return (avg-stat.ex)/stat.sigma;
  }
  function dump_summary(results, scales, c100){
    print('sigma', candsHead.map(c=>c.replace(/\s/g,'')).concat(c100||[]));
    for (var i in results) for (var j=0;j<scales.length;j++)
      print(i+'::'+scales[j],
            candsHead.map(c => calc_err_sigma(results[i].diffs.theory.simple[c].avg, results[i].diffs.theory.simple['C100'].STATS[scales[j]])).concat(
              c100 && [results[i].diffs.theory.simple['C100'].STATS[scales[j]].ex, results[i].diffs.theory.simple['C100'].STATS[scales[j]].sigma] || []
            ));
  }
  function dump_detail(cands, res){
    print('cands', cands.map(c=>c.replace(/\s/g,'')).join());
    for (var i=1;i<10;i++) print(i, cands.map(c=>res.props[c]===undefined? '' : res.props[c][i]));
    print('votes', cands.map(c=>res.bens[c]? res.bens[c].votes : ''));
    print('nof_regions', cands.map(c=>res.props[c]? res.props[c].nof_regions : ''));
    ['simple', /*'weighted',*/ 'weighted2'].forEach(d=>{
      var tgt = res.diffs.theory[d];
      print('diff::'+d, cands.map(c=> tgt[c]===undefined? '' : tgt[c].avg));
      ['Log','Log4060','Log4555'].forEach(ss=>{
        print('diff::'+d+'::'+ss+'::'+'err/C100sigma', cands.map(c=>tgt[c]===undefined || c==='theory'? '' : calc_err_sigma(tgt[c].avg, tgt['C100'].STATS[ss])));
        ['ex', 'sigma', 'max', 'min'].forEach(s=>
          print('diff::'+d+'::'+ss+'::'+s, cands.map(c=> tgt[c]===undefined || c==='theory'? '' : tgt[c].STATS[ss][s])))
      });
    });
  }
})();

  function make_diffs(props){
    var simple= {};
    var weighted = {};
    var weighted2 = {};
    for (var c in props){
      simple[c] = {avg:0};
      weighted[c] = {avg:0};
      weighted2[c] = {avg:0};
      var num = 0;
      for (var i in props[c]) {
        simple[c][i] = Math.abs(props[c][i]-props_theoretical[i]);
        simple[c].avg += simple[c][i];
        weighted[c][i] = simple[c][i]/props_theoretical[i];
        weighted[c].avg += weighted[c][i];
        weighted2[c][i] = weighted[c][i]*props_theoretical.ex;
        weighted2[c].avg += weighted[c][i];
        num++;
      }
      simple[c].avg /= num;
      weighted[c].avg /= num;
      weighted2[c].avg /= num;
    }
    return {simple, weighted};
  }

(function(){
  var sigmas = {};
  for (var s in obj.res.states) {
    sigmas[s] = {};  for (var c in obj.res.states[s].diffs.theory.simple) {
      var simple = obj.res.states[s].diffs.theory.simple;
      sigmas[s][c] = (simple[c].avg - simple['C100'].STATS.Log.ex)/simple['C100'].STATS.Log.sigma;  }}1.4394550264380106
})();

  //  var counties = JSON.parse(document.body.textContent);
  //  var div = document.createElement('div');
  //  div.innerHTML = '<div>'+JSON.stringify(result)+'</div><div>'+JSON.stringify(props)+'</div>';
  //  document.body.insertBefore(div, document.body.firstChild)


