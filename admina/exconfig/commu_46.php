<?
(!defined('M_COM') || !defined('M_ADMIN')) && exit('No Permission');
if(!submitcheck('bcommudetail')) {
	tabheader('������Ŀ����-'.$commu['cname'],'commudetail',"?entry=$entry&action=$action&cuid=$cuid",2,0,1);
	setChidsBar(@$commu['cfgs']['chids'],'chid');
	$issms = makeradio('communew[cfgs][issms]',array('��','��'),$commu['cfgs']['issms']);
	$smsfee = makeradio('communew[cfgs][smsfee]',array('sadm'=>'����Ա','scom'=>'���򷢲���','get'=>'���������'),$commu['cfgs']['smsfee']);
	trbasic('�Ƿ����ֻ�����֪ͨ','',$issms,'',array('guide'=>'���Ž�����Ϊ��Դ�����ߣ��Ⱦ����˻����(��ͨ��Ա)��'));
	trbasic('���ŷ��óе���','',$smsfee,'');
	trbasic('����֪ͨ����ģ��','communew[cfgs][smscon]',$commu['cfgs']['smscon'],'textarea',array('w'=>300,'h' => 100,'guide'=>'������180�֣����������70�����ڣ�����70���ַ���Լ��ÿ70�ֿ�һ�����ŷ��ã�<br>ģ���������\'{$xxx}\'��ʽ��֧�ֽ����ֶ�'));
	trbasic('����Ȩ������','communew[cfgs][pmid]',makeoption(pmidsarr('cuadd'),@$commu['cfgs']['pmid']),'select');
	trbasic('�ظ�����ʱ����(����)','communew[cfgs][repeattime]',@$commu['cfgs']['repeattime'],'text',array('validate' => " rule=\"int\" min=\"0\"",'w' => 10,'guide' => '��λ������'));
	trbasic('��ע','communew[remark]',$commu['remark'],'text',array('w'=>50));
	trbasic('����˵��','communew[content]',$commu['content'],'textarea',array('w' => 500,'h' => 300,));
	tabfooter('bcommudetail','�޸�');
}else{
	empty($communew['cfgs']['chids']) && $communew['cfgs']['chids'] = array();
    $communew['cfgs']['chids'] = array_filter($communew['cfgs']['chids']);
	$communew['content'] = empty($communew['content']) ? '' : trim($communew['content']);
	$communew['remark'] = empty($communew['remark']) ? '' : trim(strip_tags($communew['remark']));
	$communew['cfgs'] = !empty($communew['cfgs']) ? addslashes(var_export($communew['cfgs'],TRUE)) : '';
 	$cfgs = ",cfgs='$communew[cfgs]'";
	$db->query("UPDATE {$tblprefix}acommus SET 
				remark='$communew[remark]',
				content='$communew[content]' $cfgs
				WHERE cuid='$cuid'");
	cls_CacheFile::Update('commus');
	adminlog('�༭������Ŀ'.$commu['cname']);
	cls_message::show('������Ŀ������ɡ�',axaction(6,"?entry=$entry&action=$action&cuid=$cuid"));
}

?>