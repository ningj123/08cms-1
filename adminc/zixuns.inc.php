<?PHP

/* ������ʼ������ */
$lpchid = empty($lpchid) ? 4 : $lpchid;
$lpchid = in_array($lpchid,array(4,115,116)) ? $lpchid : cls_messag::show('��������');
$chid = 1;//���붨�壬�����ܴ�url�Ĵ���
//$chid = empty($chid) ? 0 : max(0,intval($chid));//�����ⲿ��chid����Ҫ��������

#-----------------

$oL = new cls_archives(array(
'chid' => $chid,//ģ��id������
'url' => "?action=$action&lpchid=$lpchid",//����url���������Ҫ����chid��pid
'pre' => 'a.',//Ĭ�ϵ�����ǰ׺
'where' => "a.mid='{$curuser->info['mid']}'",//sql�еĳ�ʼ��where���޶�Ϊ���ѵ��ĵ�
'from' => "",//sql�е�FROM����
'select' => "",//sql�е�SELECT����
'cols' => 0,//Ĭ��Ϊ0����Ϊ����1��Ϊ�����ĵ�ģʽ����ͼƬ�б�(�趨һ��Ԫ�ز���Ҫ������)
'coids' => array(1,),//�ֶ�����������ϵ
//'fields' => array(),//���������װ�����ֶλ���
));
//ͷ���ļ����������
$oL->top_head();

//������Ŀ ****************************
//s_additem($key,$cfg)
$oL->s_additem('keyword',array('fields' => array(),));//keys������Ĭ��Ϊarray('a.subject' => '����','a.mname' => '��Ա','a.aid' => '�ĵ�ID')
$oL->s_additem('caid',array('ids' => array(502,504)));
$oL->s_additem('orderby');
//$oL->s_additem('shi',array('type'=>'field',));
//$oL->s_additem('valid');
foreach($oL->A['coids'] as $k){
	$oL->s_additem("ccid$k",array());
}
$oL->s_additem('checked');
$oL->s_additem('indays');
$oL->s_additem('outdays');

//����sql��filter�ִ�����
$oL->s_deal_str();





cls_cache::Load('mconfigs');
$total_refreshes = $mconfigs['salesrefreshes'];
$refresh = $db->result_one("SELECT refreshes FROM {$tblprefix}members WHERE mid = '$memberid'");
$refresh = empty($refresh)?'0':$refresh;
$style = " style='font-weight:bold;color:#F00'";
$msgstr = "����ˢ��:<span$style>$refresh/$total_refreshes</span>��";
$re_refresh = $total_refreshes - $refresh; $re_refresh = $re_refresh<0 ? 0 : $re_refresh;


//����������Ŀ ********************
$oL->o_additem('delete');//ɾ��
$oL->o_additem('readd',array('limit'=>$re_refresh,'time'=>0,'fieldname'=>'refreshes'));
$oL->o_additem('static',array('title'=>'���ɾ�̬'));



if(!submitcheck('bsubmit')){
	
	//�������� ******************
	backnav($lpchid==4 ? 'loupanbar' : 'loupanbus','zixun');
	$oL->guide_bm($msgstr,'fix');
	$oL->s_header();
	$oL->s_view_array(array('keyword','orderby','checked',));//�̶���ʾ��
	//$oL->s_adv_point();//����������
	$oL->s_view_array();
	$oL->s_footer();
	

	//��ʾ�б���ͷ�� ***************
	$oL->m_header();
	
	//�����б���Ŀ������б����а������������Ҫ�����ݴ���ʱ������������Ĵ���
	//���飬���ȳ��ֵ��������м��룺'group' =>'item,���ݷָ���,�����ָ���',���ݷָ�������ֱ������,�����б���ķָ���������ֻʹ�õ�һ�����
	
	$oL->m_additem('selectid');
	$oL->m_additem('subject',array('len' => 40,));
	$oL->m_additem('caid');
	$oL->m_additem('checked',array('type'=>'bool','title'=>'���',));
	$oL->m_additem('clicks',array('title'=>'���',));
	foreach($oL->A['coids'] as $k){
		$oL->m_additem("ccid$k",array('view'=>'',));
	}
	//$oL->m_additem('valid');
//	$oL->m_additem('shi',array('type'=>'field',));
//	$oL->m_additem('ting',array('type'=>'field',));
//	$oL->m_additem('createdate',array('type'=>'date',));
	$oL->m_additem('refreshdate',array('type'=>'date','view'=>'',));	
	//$oL->m_additem('enddate',array('type'=>'date',));
	$oL->m_additem('info',array('type'=>'url','title'=>'����','mtitle'=>'����','url'=>"?action=archiveinfo&aid={aid}",'width'=>40,));
	$oL->m_additem('detail',array('type'=>'url','title'=>'�༭','mtitle'=>'����','url'=>"?action=zixunadd&aid={aid}",'width'=>40,));
	
	//$oL->m_addgroup('{shi}/{ting}','{shi}/{ting}');//��ע����鲻��Ƕ�ף�ÿ��ֻ�ܲ���һ�η���
	//$oL->m_mcols_style("{selectid} &nbsp;{subject}<br>{shi}/{ting]/{chu}");//�����ĵ�ģʽ������ʾ��Ŀ�������ʽ,Ĭ��Ϊ��"{selectid} &nbsp;{subject}"
	
	//��ʾ�����У����ж���չʾ�Ļ�����Ҫ
	$oL->m_view_top();
	
	//ȫ���б��������������Ҫ���ƣ�����ʹ�����е�ϸ�ַ���
	$oL->m_view_main();
	
	//��ʾ�б���β��
	$oL->m_footer();
	
	//��ʾ����������************
	$oL->o_header();
	
	//��ʾ��ѡ��
	//$oL->o_view_bools('���б���',array('bool1','bool2',));
	$oL->o_view_bools();
	
	//��ʾ������
	$oL->o_view_rows();
	
	$oL->o_footer('bsubmit');
	$oL->guide_bm("���б�ֻ��ʾ/�����Լ����ӵ�¥����Ѷ����������ڣ�����¥�� - ����ĳ��¥���� ���ӡ�",'fix');
	
}else{
	//Ԥ������δѡ�����ʾ
	$oL->sv_header();
	
	//�б���������������ݴ���
//	$oL->sv_e_additem('clicks',array());
//	$oL->sv_e_all();
	
	//��������������ݴ���
	$oL->sv_o_all();
	
	//��������
	$oL->sv_footer();
}
?>