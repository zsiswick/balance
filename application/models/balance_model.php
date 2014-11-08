<?php
class Balance_model extends CI_Model {

  public function __construct()
  {
    $this->load->database();
  }

  public function get_balance()
  {
    $this->db->select("*", false);
    $this->db->from('reg_items');
    $this->db->order_by("id", "asc");
    $query = $this->db->get();
    return $query->result_object();
  }

  public function set_item($data)
  {
    $data = array(
      'date' => $data['date'], 'amount' => $data['amount'], 'type' => $data['type'], 'description' => $data['description'], 'category' => $data['category']
    );

    $this->db->insert('reg_items', $data);
    $data['id'] = $this->db->insert_id();
    return $data;
  }

  public function update_item($data)
  {
    $id = $data['id'];
    $idata = array(
      'date' => $data['date'], 'amount' => $data['amount'], 'type' => $data['type'], 'description' => $data['description'], 'category' => $data['category']
    );
    $this->db->where('id', $id);
    return $this->db->update('reg_items', $idata);
  }
}
