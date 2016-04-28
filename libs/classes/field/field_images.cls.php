<?php
/* 
** ��ͬ���͵��ֶε����ã�ʹ�÷�������
** ���cls_fieldconfig��ͬ����������չ���� ��public static function ex_demo()
*/
!defined('M_COM') && exit('No Permission');
class cls_field_images extends cls_fieldconfig{
	
	# ����֮��ͬ�����ֶ���ϱ༭����
    public static function _fm_custom_region(){
		
		self::_fm_notnull();
		self::_fm_min_max();
		self::_fm_guide();
		self::_fm_rpid();
		self::_fm_wmid();
		parent::_fm_autoCompression();
		self::_fm_search();
		self::_fm_cfgs();
	}
	# ����֮��ͬ�����ֶε����ݴ���
    public static function _sv_custom_region(){
		foreach(array('min','max') as $key){
			self::$newField[$key] = max(0,intval(self::$fmdata[$key]));
			self::$newField[$key] = empty(self::$newField[$key]) ? '' : self::$newField[$key];
		}
	}
	# ����֮������������
    protected static function _fm_min_max(){
		$ValueMin = empty(self::$oldField['min']) ? '' : self::$oldField['min'];
		$ValueMax = empty(self::$oldField['max']) ? '' : self::$oldField['max'];
		trrange('������������', array('fmdata[min]',$ValueMin,'','&nbsp; -&nbsp; ',5, 'validate' => makesubmitstr('fmdata[min]',0,'int')),
								array('fmdata[max]',$ValueMax,'','',5, 'validate' => makesubmitstr('fmdata[max]',0,'int')));
	}
    
    # ����֮��������,��ͼ���и�ΪͼƬ����2�Ŀ���
    protected static function _fm_search(){
			$issearcharr = array('0' => '�ر�','1' => '����',);
			$Value = self::$isNew ? 0 : self::$oldField['issearch'];
			trbasic('ͼƬ����2','',makeradio('fmdata[issearch]',$issearcharr,$Value),'',array('guide'=>'ͼƬ����2���أ�Ĭ��Ϊ�ر�״̬��ͼƬ����2������������������imgComment��'));
	}
    
}